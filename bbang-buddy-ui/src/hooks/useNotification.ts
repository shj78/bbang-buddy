'use client';

import { useEffect, useRef } from 'react';
import useNotificationStore from '../store/useNotificationStore';
import { useAuthStore } from '../store/useAuthStore';
import { getCookie } from '../utils/cookieUtils';
import { isBrowser } from '@/utils/typeUtils';

const useNotification = () => {
  const { getNotifications, addNotification } = useNotificationStore();
  const { isAuthenticated } = useAuthStore();
  const eventSourceRef = useRef<EventSource | null>(null);
  const token = getCookie('authToken');

  const getApiUrl = () => {
    if (isBrowser() && window.location.hostname === 'localhost') {
      return process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
    }
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      return process.env.NEXT_PUBLIC_API_BASE_URL;
    }

    // TODO: 배포 환경에서는 현재 도메인 사용 테스트 (CORS 문제 해결)
    // if (isBrowser()) {
    //     return window.location.origin;
    // }

    return process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 useEffect 진입:', {
        isAuthenticated,
        token,
        tokenExists: !!token,
        tokenValue: token,
      });
    }

    if (!isAuthenticated || !token) {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ 조건 미충족으로 return:', {
          isAuthenticated,
          token,
        });
      }
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ 조건 통과, setupSSEConnection 시작');
    }

    const setupSSEConnection = async () => {
      try {
        if (eventSourceRef.current) {
          if (process.env.NODE_ENV === 'development') {
            console.log('🔄 기존 SSE 연결 종료 중...');
          }
          eventSourceRef.current.close();
        }

        const currentToken = getCookie('authToken');
        const apiUrl = getApiUrl();
        const sseUrl = `${apiUrl}/api/notification/subscribe?token=${encodeURIComponent(currentToken || '')}`;

        if (process.env.NODE_ENV === 'development') {
          console.log('🚀 SSE 연결 시도:', {
            url: `${apiUrl}/api/notification/subscribe?token=***`,
            isAuthenticated,
            tokenExists: !!currentToken,
            tokenPreview: currentToken
              ? `${currentToken.substring(0, 20)}...`
              : 'null',
          });
        }

        const eventSource = new EventSource(sseUrl);
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('📥 새 알림 수신:', {
              rawData: event.data,
              timestamp: new Date().toISOString(),
            });
          }

          try {
            const notification = JSON.parse(event.data);

            if (process.env.NODE_ENV === 'development') {
              console.log('✅ 알림 파싱 성공:', notification);
            }

            addNotification(notification);
            if (process.env.NODE_ENV === 'development') {
              console.log('✅ 스토어에 알림 추가 완료');
            }
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('❌ 알림 데이터 파싱 오류:', {
                error,
                rawData: event.data,
              });
            }
          }
        };

        eventSource.onopen = () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ SSE 연결 성공');
          }
        };

        eventSource.onerror = (error) => {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ SSE 연결 오류:', {
              error,
              readyState: eventSource.readyState,
              url: eventSource.url,
            });
          }
          if (eventSource.readyState !== EventSource.CLOSED) {
            eventSource.close();
          }
          eventSourceRef.current = null;

          if (process.env.NODE_ENV === 'development') {
            console.log('🔄 5초 후 수동 재연결 시도...');
          }
          setTimeout(() => {
            const currentToken = getCookie('authToken');
            const { isAuthenticated } = useAuthStore.getState();

            if (process.env.NODE_ENV === 'development') {
              console.log('🔍 재연결 시도:', {
                isAuthenticated,
                currentToken: currentToken,
                hasEventSource: !!eventSourceRef.current,
              });
            }

            if (isAuthenticated && currentToken && !eventSourceRef.current) {
              setupSSEConnection();
            } else {
              if (process.env.NODE_ENV === 'development') {
                console.warn('❌ 재연결 조건 미충족');
              }
            }
          }, 5000);
        };
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('알림 구독 실패:', error);
        }
      }
    };

    setupSSEConnection();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [isAuthenticated, token, addNotification]);

  const checkForNewNotifications = async () => {
    try {
      if (token) {
        await getNotifications();
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('알림 확인 중 오류:', error);
      }
    }
  };

  return {
    checkForNewNotifications,
  };
};

export default useNotification;
