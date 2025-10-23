export const FORM_CONSTANTS = {
  DEFAULT_MAX_PARTICIPANTS: 1,
  MIN_PARTICIPANTS: 2,
  MAX_PARTICIPANTS: 10,

  IMAGE_HEIGHT: '160px',
  MODAL_WIDTH: { xs: '90%', sm: 500 },
  MODAL_MAX_HEIGHT: '86vh',
  BUTTON_HEIGHT: '50px',

  PLACEHOLDERS: {
    title: '우리는 N빵의 민족이니까',
    description: '어떤 팟인지 자세히 설명해주세요(URL, 가격...)',
    address: '주소를 입력해주세요',
  },

  ERROR_MESSAGES: {
    addressRequired: '주소를 입력해주세요.',
    addressNotFound:
      '주소나 장소명을 찾을 수 없습니다. 다른 키워드로 시도해보세요.',
    kakaoApiNotLoaded: '카카오맵 API가 로드되지 않았습니다.',
    locationRequired: '주소를 검색하여 위치를 확인해주세요.',
    createError: '팟 생성 중 오류가 발생했습니다. 다시 시도해주세요.',
  },

  BUTTON_TEXTS: {
    cancel: '취소하기',
    create: '팟 만들기',
    creating: '생성 중...',
    imageSelect: '이미지 선택',
    imageChange: '이미지 변경',
  },

  LABELS: {
    title: '팟 이름',
    description: '팟 설명',
    maxParticipants: '최대 참가자 수',
    address: '주소',
    dueDate: '팟 종료일',
    modalTitle: '무슨 팟을 만들고 싶으신가요?',
  },

  DATE_FORMAT: 'YYYY.MM.DD HH:mm',
  DATE_TIME_FORMAT: 'YYYY-MM-DDTHH:mm:ss',
} as const;

export type FormConstantKey = keyof typeof FORM_CONSTANTS;
