import React, { useState } from 'react';
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
import { Close, PhotoCamera, Search } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useCreatePot } from '../../hooks/usePots';
import { CreatePotModalProps, PotFormData } from '../../types/pot';
import { FORM_CONSTANTS } from '../../constants/formConstants';
import { searchAddressWithKakao } from '../../utils/geocodingUtils';
import { GeocodingResult } from '../../types/geocoding';
import { useForm } from 'react-hook-form';
import {
  commonTextFieldStyles,
  buttonStyles,
  dateTimePickerSlotProps,
  modalStyles,
  stackStyles,
} from '../../theme/components';
import { useOnceEffect } from '../../hooks/useOnceEffect';
import Script from 'next/script';
import { isBrowser } from '@/utils/typeUtils';
import { toast } from 'sonner';
const CreatePotModal = ({ open, onClose }: CreatePotModalProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);

  useOnceEffect(() => {
    if (isBrowser() && window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {});
    }
  });

  const createPotMutation = useCreatePot();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<PotFormData>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      maxParticipants: FORM_CONSTANTS.DEFAULT_MAX_PARTICIPANTS,
      category: '',
      currentParticipants: 1,
      address: '',
      latitude: null,
      longitude: null,
      dueDate: new Date(),
      image: null,
      chatRoomUrl: '',
    },
  });
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('image', file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const searchAddress = () => {
    searchAddressWithKakao(
      getValues('address'),
      (result: GeocodingResult) => {
        setValue('latitude', result.latitude);
        setValue('longitude', result.longitude);
        setValue('address', result.address);
        setGeocodingError(null);
      },
      (error: string) => {
        setGeocodingError(error);
      },
      (isLoading: boolean) => {
        setIsSearchingAddress(isLoading);
      }
    );
  };

  const onSubmit = async ({
    data,
    image,
  }: {
    data: PotFormData;
    image: File | null;
  }) => {
    try {
      await createPotMutation.mutateAsync({
        potData: data,
        image: image || null,
      });
      reset();
      setImagePreview(null);
      setGeocodingError(null);
      onClose();
      toast.success('팟 생성에 성공했습니다!');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
      toast.error('팟 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`}
        strategy="afterInteractive"
        id="kakao-map-script"
      />
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyles.container}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" component="h2">
              {FORM_CONSTANTS.LABELS.modalTitle}
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>

          <Stack
            component="form"
            onSubmit={handleSubmit((data) =>
              onSubmit({ data, image: getValues('image') || null })
            )}
            noValidate
            spacing={2}
          >
            <TextField
              label={FORM_CONSTANTS.LABELS.title}
              {...register('title', {
                required: '팟 제목을 입력해주세요',
                minLength: {
                  value: 1,
                  message: '팟 제목은 1자 이상이어야 합니다.',
                },
                maxLength: {
                  value: 100,
                  message: '팟 제목은 100자 이하여야 합니다.',
                },
              })}
              sx={commonTextFieldStyles}
            />

            <TextField
              label={FORM_CONSTANTS.LABELS.description}
              {...register('description', {
                required: '팟 설명을 입력해주세요',
              })}
              multiline
              rows={3}
              sx={commonTextFieldStyles}
            />

            <TextField
              label={FORM_CONSTANTS.LABELS.maxParticipants}
              {...register('maxParticipants', {
                required: '최대 참가자 수를 입력해주세요',
                min: {
                  value: FORM_CONSTANTS.MIN_PARTICIPANTS,
                  message: '최소 참가자 수는 2명 이상입니다.',
                },
                max: {
                  value: FORM_CONSTANTS.MAX_PARTICIPANTS,
                  message: '최대 참가자 수는 10명 이하입니다.',
                },
                valueAsNumber: true,
              })}
              error={!!errors.maxParticipants?.message}
              helperText={errors.maxParticipants?.message}
              type="number"
              sx={commonTextFieldStyles}
            />

            <Box>
              <Stack direction="row" spacing={1}>
                <TextField
                  {...register('address', {
                    required: '주소를 입력해주세요',
                  })}
                  label={FORM_CONSTANTS.LABELS.address}
                  fullWidth
                  disabled={isSearchingAddress}
                  sx={commonTextFieldStyles}
                />
                <Button
                  variant="outlined"
                  onClick={searchAddress}
                  disabled={createPotMutation.isPending || isSearchingAddress}
                  startIcon={
                    isSearchingAddress ? (
                      <CircularProgress size={16} />
                    ) : (
                      <Search />
                    )
                  }
                  sx={buttonStyles.search}
                ></Button>
              </Stack>

              {geocodingError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {geocodingError}
                </Alert>
              )}
            </Box>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <DateTimePicker
                label={FORM_CONSTANTS.LABELS.dueDate}
                {...register('dueDate', {
                  required: '팟 종료일을 선택해주세요',
                })}
                onChange={(newValue) => {
                  setValue('dueDate', newValue);
                }}
                format={FORM_CONSTANTS.DATE_FORMAT}
                ampm={false}
                localeText={{
                  cancelButtonLabel: '취소',
                  okButtonLabel: '확인',
                }}
                slotProps={dateTimePickerSlotProps}
              />
            </LocalizationProvider>

            <Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={!imagePreview ? <PhotoCamera /> : null}
                sx={buttonStyles.imageUpload(imagePreview)}
              >
                {imagePreview
                  ? FORM_CONSTANTS.BUTTON_TEXTS.imageChange
                  : FORM_CONSTANTS.BUTTON_TEXTS.imageSelect}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
            </Box>

            {/* 팟 생성 에러 */}
            {createPotMutation.error && (
              <Alert severity="error">
                {FORM_CONSTANTS.ERROR_MESSAGES.createError}
              </Alert>
            )}

            {/* 액션 버튼 */}
            <Stack {...stackStyles.actionButtons}>
              <Button
                onClick={onClose}
                disabled={createPotMutation.isPending}
                sx={buttonStyles.cancel}
              >
                {FORM_CONSTANTS.BUTTON_TEXTS.cancel}
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={createPotMutation.isPending}
                startIcon={
                  createPotMutation.isPending ? (
                    <CircularProgress size={16} />
                  ) : null
                }
                sx={buttonStyles.submit}
              >
                {createPotMutation.isPending
                  ? FORM_CONSTANTS.BUTTON_TEXTS.creating
                  : FORM_CONSTANTS.BUTTON_TEXTS.create}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default CreatePotModal;
