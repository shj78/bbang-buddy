import React, { useState } from "react";
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
} from "@mui/material";
import { Close, PhotoCamera, Search } from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useCreatePot } from "../../hooks/usePots";
import { PotCreateRequest, PotFormData } from "../../types/pot";
import { CreatePotModalProps } from "../../types/pot";
import { FORM_CONSTANTS } from "../../constants/formConstants";
import { searchAddressWithKakao } from "../../utils/geocodingUtils";
import { GeocodingResult } from "../../types/geocoding";
import {
    commonTextFieldStyles,
    buttonStyles,
    dateTimePickerSlotProps,
    modalStyles,
    stackStyles,
} from "../../theme/components";

const CreatePotModal = ({ open, onClose, onSuccess }: CreatePotModalProps) => {
    const [formData, setFormData] = useState<PotFormData>({
        title: "",
        description: "",
        maxParticipants: FORM_CONSTANTS.DEFAULT_MAX_PARTICIPANTS,
        category: "",
        address: "",
        latitude: null,
        longitude: null,
        dueDate: null,
        image: null,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSearchingAddress, setIsSearchingAddress] = useState(false);
    const [geocodingError, setGeocodingError] = useState<string | null>(null);

    // 팟 생성 훅 사용 (useMutation 기반)
    const createPotMutation = useCreatePot();

    // 폼 유효성 검사 (단순 계산)
    const isFormValid = !!(
        formData.title &&
        formData.description &&
        formData.address &&
        formData.dueDate &&
        formData.latitude !== null &&
        formData.longitude !== null
    );

    // 버튼 비활성화 조건들 (단순 계산)
    const isAddressSearchDisabled =
        isSearchingAddress || !formData.address.trim();
    const isSubmitDisabled = createPotMutation.isPending || !isFormValid;

    /**
     * 🔄 폼 데이터 초기화 함수
     * - 모든 입력 필드를 기본값으로 리셋
     * - 이미지 미리보기와 에러 메시지도 함께 초기화
     * - handleSubmit과 handleClose에서 공통으로 사용 (DRY 원칙)
     */
    const resetFormData = () => {
        setFormData({
            title: "",
            description: "",
            maxParticipants: FORM_CONSTANTS.DEFAULT_MAX_PARTICIPANTS,
            category: "",
            address: "",
            latitude: null,
            longitude: null,
            dueDate: null,
            image: null,
        });
        setImagePreview(null);
        setGeocodingError(null);
    };

    /**
     * 🔄 입력 필드 변경 핸들러
     * - 모든 텍스트/숫자 입력 필드에서 공통으로 사용
     * - 고차 함수(Higher-Order Function, 어떤 필드 업데이트할 지 1차 매개변수와 실제 입력 이벤트에 해당하는 2차 매개변수) 패턴으로 필드명을 받아서 함수 반환
     * @param field PotFormData의 키 (title, description, maxParticipants 등)
     * @returns 실제 이벤트 핸들러 함수(이런 이유로 고차함수)
     */
    const handleInputChange =
        (field: keyof PotFormData) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            //상태 업데이트
            setFormData({
                ...formData,
                [field]: event.target.value,
            });
        };

    /**
     * 📷 이미지 업로드 핸들러
     * - 사용자가 이미지 파일을 선택했을 때 실행
     * - File 객체를 formData에 저장하고 미리보기 URL 생성
     * - FileReader API를 사용해 이미지를 Base64로 변환하여 미리보기 제공
     * @param event 파일 입력 이벤트
     */
    //! 이미지를 여러개 클릭했을 때 예외처리, 확장자 설정
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string); //타입 단언(타입 추론 불가) <> 타입 가드 if(typeof e.target?.result === 'string'...)
            };
            reader.readAsDataURL(file);
        }
    };

    /**
     * 🔍 주소 검색 핸들러
     * - 새로운 지오코딩 유틸리티 사용으로 복잡도 감소
     * - 상태 관리는 콜백을 통해 처리
     */
    const searchAddress = () => {
        searchAddressWithKakao(
            formData.address,
            // 성공 콜백
            (result: GeocodingResult) => {
                setFormData((prev) => ({
                    ...prev,
                    latitude: result.latitude,
                    longitude: result.longitude,
                    address: result.address,
                }));
                setGeocodingError(null);
            },
            // 에러 콜백
            (error: string) => {
                setGeocodingError(error);
            },
            // 로딩 상태 콜백
            (isLoading: boolean) => {
                setIsSearchingAddress(isLoading);
            }
        );
    };

    /**
     * 📝 주소 입력 변경 핸들러
     * - 사용자가 주소 입력 필드에 타이핑할 때마다 실행
     * - 주소가 변경되면 기존 좌표를 null로 초기화 (재검색 필요)
     * - 주소 검색 에러 메시지도 초기화
     * @param event 입력 필드 변경 이벤트
     */
    const handleAddressChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const address = event.target.value;
        setFormData({
            ...formData,
            address,
            latitude: null,
            longitude: null,
        });
        setGeocodingError(null);
    };

    /**
     * 📝 폼 제출 핸들러
     * - 폼 유효성 검사 후 useCreatePot 훅을 사용하여 팟 생성 요청
     * - 좌표 검증: latitude/longitude가 null이면 주소 재검색 요구
     * - 성공/실패 처리는 usePots.tsx의 useCreatePot에서 자동 처리
     */
    const handleSubmit = () => {
        // 폼 유효성 검사 (메모이제이션된 값 사용)
        if (!isFormValid) {
            if (formData.latitude === null || formData.longitude === null) {
                setGeocodingError(
                    FORM_CONSTANTS.ERROR_MESSAGES.locationRequired
                );
            }
            return;
        }

        // 팟 데이터 구성 (isFormValid=true이므로 모든 값이 보장됨)
        const potData: PotCreateRequest = {
            title: formData.title,
            description: formData.description,
            maxParticipants: formData.maxParticipants,
            currentParticipants: 1, // 생성자 본인 포함하여 1로 시작
            category: formData.category,
            address: formData.address,
            latitude: formData.latitude!, // isFormValid=true이므로 null이 아님
            longitude: formData.longitude!, // isFormValid=true이므로 null이 아님
            dueDate: formData.dueDate!.format(FORM_CONSTANTS.DATE_TIME_FORMAT), // isFormValid=true이므로 null이 아님
        };

        // useMutation으로 팟 생성 요청
        createPotMutation.mutate(
            { potData, image: formData.image },
            {
                onSuccess: () => {
                    resetFormData();
                    if (onSuccess) onSuccess();
                    onClose();
                },
            }
        );
    };

    /**
     * ❌ 모달 닫기 핸들러
     * - 사용자가 취소 버튼이나 X 버튼을 클릭했을 때 실행
     * - 모든 폼 데이터와 상태를 초기값으로 리셋
     * - 이미지 미리보기와 에러 메시지도 모두 초기화
     * - 부모 컴포넌트의 onClose 콜백 호출하여 모달 닫기
     */
    const handleClose = () => {
        resetFormData();
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
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
                    <IconButton onClick={handleClose}>
                        <Close />
                    </IconButton>
                </Box>

                <Stack spacing={2}>
                    {/* 제목 */}
                    <TextField
                        label={FORM_CONSTANTS.LABELS.title}
                        value={formData.title}
                        onChange={handleInputChange("title")}
                        placeholder={FORM_CONSTANTS.PLACEHOLDERS.title}
                        sx={commonTextFieldStyles}
                    />

                    {/* 설명 */}
                    <TextField
                        label={FORM_CONSTANTS.LABELS.description}
                        value={formData.description}
                        onChange={handleInputChange("description")}
                        fullWidth
                        multiline
                        rows={3}
                        placeholder={FORM_CONSTANTS.PLACEHOLDERS.description}
                        sx={commonTextFieldStyles}
                    />

                    {/* 최대 참가자 수 */}
                    <TextField
                        label={FORM_CONSTANTS.LABELS.maxParticipants}
                        type="number"
                        value={formData.maxParticipants}
                        onChange={handleInputChange("maxParticipants")}
                        fullWidth
                        inputProps={{
                            min: FORM_CONSTANTS.MIN_PARTICIPANTS,
                            max: FORM_CONSTANTS.MAX_PARTICIPANTS,
                        }}
                        sx={commonTextFieldStyles}
                    />

                    {/* 주소 */}
                    <Box>
                        <Stack direction="row" spacing={1}>
                            <TextField
                                value={formData.address}
                                label={FORM_CONSTANTS.LABELS.address}
                                onChange={handleAddressChange}
                                fullWidth
                                placeholder={
                                    FORM_CONSTANTS.PLACEHOLDERS.address
                                }
                                disabled={isSearchingAddress}
                                sx={commonTextFieldStyles}
                            />
                            <Button
                                variant="outlined"
                                onClick={searchAddress}
                                disabled={isAddressSearchDisabled}
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

                        {/* 주소 검색 에러 */}
                        {geocodingError && (
                            <Alert severity="error" sx={{ mt: 1 }}>
                                {geocodingError}
                            </Alert>
                        )}
                    </Box>

                    {/* 팟 종료 기간 */}
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="ko"
                    >
                        <DateTimePicker
                            label={FORM_CONSTANTS.LABELS.dueDate}
                            value={formData.dueDate}
                            onChange={(newValue) => {
                                setFormData({ ...formData, dueDate: newValue });
                            }}
                            format={FORM_CONSTANTS.DATE_FORMAT}
                            ampm={false}
                            localeText={{
                                cancelButtonLabel: "취소",
                                okButtonLabel: "확인",
                            }}
                            slotProps={dateTimePickerSlotProps}
                        />
                    </LocalizationProvider>

                    {/* 이미지 업로드 */}
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
                            onClick={handleClose}
                            disabled={createPotMutation.isPending}
                            sx={buttonStyles.cancel}
                        >
                            {FORM_CONSTANTS.BUTTON_TEXTS.cancel}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isSubmitDisabled}
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
    );
};

export default CreatePotModal;
