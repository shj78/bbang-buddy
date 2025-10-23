import { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Close, PhotoCamera } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { joinPot, leavePot } from '../../lib/potApi';
import {
  getReadOnlyFieldStyles,
  getReadOnlyDateTimePickerStyles,
} from '../../styles/textFieldStyles';
import { PotFormData, PotDetailModalProps } from '../../types/pot';
import { toast } from 'sonner';
import { formatTimeRemaining } from '../../utils/timeUtils';
import { useQueryClient } from '@tanstack/react-query';
import { DEFAULT_KAKAO_IMAGE_PATH } from '../../constants/image';
import { useAuthStore } from '../../store/useAuthStore';
import Image from 'next/image';

dayjs.locale('ko');

function PotDetailModal({
  open,
  onClose,
  pot,
  isParticipating,
}: PotDetailModalProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [formData, setFormData] = useState<PotFormData>({
    title: '',
    description: '',
    maxParticipants: 1,
    category: '',
    address: '',
    latitude: null,
    longitude: null,
    dueDate: null,
    image: null,
    chatRoomUrl: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const queryClient = useQueryClient();

  const handleLeavePotClick = useCallback(async () => {
    if (!pot?.id) return;

    setIsLeaving(true);
    try {
      await leavePot(pot.id);

      toast.success('팟 탈퇴가 완료되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['pots'] });
      queryClient.invalidateQueries({ queryKey: ['myPots'] });
      onClose();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        axiosError.response?.data?.message || '팟 탈퇴 중 오류가 발생했습니다.'
      );
    } finally {
      setIsLeaving(false);
    }
  }, [pot?.id, queryClient, onClose]);

  const handleJoinPotClick = useCallback(async () => {
    if (!pot?.id) return;

    setIsJoining(true);
    try {
      if (pot.currentParticipants >= pot.maxParticipants) {
        toast.warning('이미 정원이 마감된 팟입니다.');
        return;
      }

      if (pot.dueDate) {
        const now = new Date();
        if (now >= new Date(pot.dueDate)) {
          toast.warning('마감 시간이 지난 팟입니다.');
          return;
        }
      }

      await joinPot(pot.id);

      toast.success('팟 참여가 완료되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['pots'] });
      queryClient.invalidateQueries({ queryKey: ['myPots'] });
      onClose();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        axiosError.response?.data?.message || '팟 참여 중 오류가 발생했습니다.';
      toast.error(errorMessage);
    } finally {
      setIsJoining(false);
    }
  }, [
    pot?.id,
    queryClient,
    onClose,
    pot?.currentParticipants,
    pot?.dueDate,
    pot?.maxParticipants,
  ]);

  const handleClose = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      maxParticipants: 4,
      category: '',
      address: '',
      latitude: null,
      longitude: null,
      dueDate: null,
      image: null,
    });
    setImagePreview(null);
    setGeocodingError(null);
    setSubmitError(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (pot) {
      setFormData({
        title: pot.title || '',
        description: pot.description || '',
        maxParticipants: pot.maxParticipants || 1,
        category: pot.category || '',
        address: pot.address || '',
        latitude: pot.latitude || null,
        longitude: pot.longitude || null,
        dueDate: pot.dueDate ? dayjs(pot.dueDate) : null,
        image: null,
      });

      if (pot.imagePath) {
        setImagePreview(`/${pot.imagePath}`);
      }
    }
  }, [pot]);

  if (!pot) return null;

  const isLeaveDisabled = !isParticipating || isLeaving;

  const joinButtonText = isJoining
    ? '참여 중...'
    : isParticipating
      ? '참여중'
      : '참여하기';

  const leaveButtonText = isLeaving ? '탈퇴 중...' : '탈퇴하기';

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          maxHeight: '86vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h5" component="h2" sx={{ flex: 1 }}>
              팟 정보
            </Typography>
            {isParticipating && (
              <Button
                startIcon={
                  <Image
                    src={DEFAULT_KAKAO_IMAGE_PATH}
                    alt="Kakao"
                    width={20}
                    height={20}
                  />
                }
                onClick={() => {
                  if (!pot?.chatRoomUrl) {
                    toast.info('채팅방 생성중입니다. 잠시만 기다려주세요.');
                  } else {
                    window.open(pot.chatRoomUrl, '_blank');
                  }
                }}
                sx={{
                  minWidth: '36px !important',
                  maxWidth: '36px !important',
                  width: '36px !important',
                  height: 24,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  '& .MuiButton-startIcon': {
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  backgroundColor: '#fae100',
                }}
              />
            )}
          </Box>

          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>

        <Stack spacing={2}>
          <TextField
            label="팟 이름"
            value={formData.title}
            placeholder="우리는 N빵의 민족이니까"
            disabled={true}
            sx={getReadOnlyFieldStyles()}
          />

          <TextField
            label="팟 설명"
            value={formData.description}
            fullWidth
            multiline
            rows={3}
            placeholder="어떤 팟인지 자세히 설명해주세요(URL, 가격...)"
            disabled={true}
            sx={getReadOnlyFieldStyles()}
          />

          <TextField
            label="최대 참가자 수"
            type="number"
            value={formData.maxParticipants}
            fullWidth
            inputProps={{ min: 2, max: 10 }}
            disabled={true}
            sx={getReadOnlyFieldStyles()}
          />

          <Box>
            <TextField
              value={formData.address || '주소 정보 없음'}
              label="주소"
              fullWidth
              disabled={true}
              sx={getReadOnlyFieldStyles()}
            />
          </Box>

          {geocodingError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {geocodingError}
            </Alert>
          )}

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <DateTimePicker
              label="팟 종료일"
              value={formData.dueDate}
              onChange={(newValue) => {
                setFormData({ ...formData, dueDate: newValue });
              }}
              format="YYYY.MM.DD HH:mm"
              ampm={false}
              readOnly={true}
              minDateTime={dayjs()}
              maxDateTime={dayjs().add(6, 'month')}
              localeText={{
                cancelButtonLabel: '취소',
                okButtonLabel: '확인',
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  sx: getReadOnlyDateTimePickerStyles(),
                },
                actionBar: {
                  sx: {
                    '& .MuiButton-root': {
                      color: 'black !important',
                    },
                  },
                },
                day: {},
                digitalClockSectionItem: {
                  sx: {
                    '&.Mui-selected': {
                      borderRadius: '10% !important',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>

          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '160px',
                px: 2,
                bgcolor: '#f6f6f6',
                color: '#909090',
                border: 'none',
                borderRadius: 1,
                backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {!imagePreview && (
                <>
                  <PhotoCamera sx={{ mr: 1 }} />
                  <Typography>팟 이미지</Typography>
                </>
              )}
            </Box>
          </Box>

          {submitError && <Alert severity="error">{submitError}</Alert>}

          {isAuthenticated && (
            <Stack
              direction="row"
              spacing={2}
              sx={{ width: '100%', height: '50px', mt: '40px' }}
            >
              <Button
                onClick={handleLeavePotClick}
                disabled={isLeaveDisabled}
                startIcon={isLeaving ? <CircularProgress size={16} /> : null}
                sx={{
                  flex: 1,
                  bgcolor: isParticipating ? '#f6f6f6' : '#e0e0e0',
                  color: isParticipating ? 'black' : '#9e9e9e',
                  border: 'none',
                  '&:hover': {
                    bgcolor: isParticipating ? '#f6f6f6' : '#e0e0e0',
                    color: isParticipating ? '#909090' : '#9e9e9e',
                  },
                  '&:disabled': {
                    backgroundColor: '#e0e0e0',
                    color: '#9e9e9e',
                  },
                }}
              >
                {leaveButtonText}
              </Button>
              <Button
                variant="contained"
                onClick={handleJoinPotClick}
                startIcon={isJoining ? <CircularProgress size={16} /> : null}
                disabled={
                  isParticipating ||
                  formatTimeRemaining(pot.dueDate || '') === '마감'
                }
                sx={{
                  flex: 1,
                  bgcolor: isParticipating ? '#e0e0e0' : '#7DD952',
                  color: isParticipating ? '#9e9e9e' : 'black',
                  '&:disabled': {
                    backgroundColor: '#e0e0e0',
                    color: '#9e9e9e',
                  },
                }}
              >
                {joinButtonText}
              </Button>
            </Stack>
          )}
        </Stack>
      </Box>
    </Modal>
  );
}

export default PotDetailModal;
