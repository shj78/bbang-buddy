import React, { useState } from "react";
import { toast } from "sonner";
import { Modal, Box, Typography, Button } from "@mui/material";
import { Group, Schedule } from "@mui/icons-material";
import Image from "next/image";
import { joinPot, leavePot } from "../../lib/potApi";
import { useAuthStore } from "../../store/useAuthStore";
import { useMyPots } from "../../hooks/usePots";
import { CircularProgress } from "@mui/material";
import { formatTimeRemaining } from "../../utils/timeUtils";
import { DEFAULT_IMAGE_PATH } from "../../constants/image";
import { Pot } from "../../types/pot";
import { useQueryClient } from "@tanstack/react-query";

interface PotMarkerPopupProps {
    isOpen: boolean;
    onClose: () => void;
    pot: Pot;
    onJoinSuccess?: () => void; // 참여 성공 시 콜백
}

const PotMarkerPopup = ({ open, onClose, pot }: PotMarkerPopupProps) => {
    const [isJoining, setIsJoining] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const queryClient = useQueryClient();

    const { myPots } = useMyPots(isAuthenticated);

    if (!pot) return null;

    // 현재 팟이 참여 중인 팟인지 확인
    const isCurrentlyParticipating =
        (isAuthenticated &&
            myPots?.some((myPot: Pot) => myPot.id === pot?.id)) ||
        false;

    const handleJoinPotClick = async () => {
        // 로그인 체크
        if (!isAuthenticated) {
            toast.error("로그인이 필요한 기능입니다.");
            return;
        }

        if (!pot?.id) return;

        setIsJoining(true);
        try {
            // 참여 가능한 팟인지 검증
            // 1. 정원 체크
            if (pot.currentParticipants >= pot.maxParticipants) {
                toast.warning("이미 정원이 마감된 팟입니다.");
                return;
            }

            // 2. 마감 시간 체크
            if (pot.dueDate) {
                const now = new Date();
                const endTime = new Date(pot.dueDate);
                if (now >= endTime) {
                    toast.warning("마감 시간이 지난 팟입니다.");
                    return;
                }
            }

            await joinPot(pot.id);

            // 성공 시 알림
            toast.success("팟 참여가 완료되었습니다!");

            // 쿼리 캐시 무효화하여 최신 데이터 반영
            queryClient.invalidateQueries({ queryKey: ["pots"] });
            queryClient.invalidateQueries({ queryKey: ["myPots"] });

            // 모달 닫기
            onClose();
        } catch (error: unknown) {
            console.error("팟 참여 실패:", error);

            // 에러 메시지 표시
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "팟 참여 중 오류가 발생했습니다.";
            toast.error(errorMessage);
        } finally {
            setIsJoining(false);
        }
    };

    const handleLeavePotClick = async () => {
        // 로그인 체크
        if (!isAuthenticated) {
            toast.error("로그인이 필요한 기능입니다.");
            return;
        }

        if (!pot?.id) return;

        setIsLeaving(true);
        try {
            await leavePot(pot.id);

            toast.success("팟 탈퇴가 완료되었습니다!");

            // 쿼리 캐시 무효화하여 최신 데이터 반영
            queryClient.invalidateQueries({ queryKey: ["pots"] });
            queryClient.invalidateQueries({ queryKey: ["myPots"] });

            // 모달 닫기
            onClose();
        } catch (error: unknown) {
            console.error("팟 탈퇴 실패:", error);

            // 에러 메시지 표시
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "팟 탈퇴 중 오류가 발생했습니다.";
            toast.error(errorMessage);
        } finally {
            setIsLeaving(false);
        }
    };

    return (
        <>
            <Modal
                open={open}
                onClose={onClose}
                sx={{
                    "& .MuiBackdrop-root": {
                        backgroundColor: "rgba(0, 0, 0, 0.2)", // 기본값보다 옅은 backdrop
                    },
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 360,
                        height: 190,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 3, // 24px 패딩
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    {/* 상단 영역 - 이미지 + 정보 */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            flex: 1,
                            marginBottom: 2,
                        }}
                    >
                        {/* 이미지 */}
                        <Box
                            sx={{
                                width: 70,
                                height: 70,
                                backgroundColor: "#f5f5f5",
                                borderRadius: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                                position: "relative",
                                flexShrink: 0,
                            }}
                        >
                            <Image
                                src={
                                    pot?.imagePath
                                        ? `/${pot.imagePath}`
                                        : DEFAULT_IMAGE_PATH
                                }
                                fill
                                alt={pot?.title || "팟 이미지"}
                                style={{
                                    objectFit: "cover",
                                }}
                            />
                        </Box>

                        {/* 텍스트 정보 */}
                        <Box
                            sx={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                gap: 1,
                                minWidth: 0, // flex 요소가 줄어들 수 있도록 함
                                maxWidth: "calc(100% - 70px - 16px)", // 이미지와 gap을 제외한 최대 너비
                            }}
                        >
                            {/* 팟 이름 */}
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "500",
                                    fontSize: "16px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    maxWidth: "100%",
                                }}
                            >
                                {pot.title}
                            </Typography>

                            {/* 참여자수 + 남은시간 */}
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    maxWidth: "100%",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.3,
                                        minWidth: 0,
                                    }}
                                >
                                    <Group
                                        sx={{ fontSize: 14, flexShrink: 0 }}
                                        color="action"
                                    />
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            fontSize: "14px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        참여자: {pot.currentParticipants}/
                                        {pot.maxParticipants}명
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.3,
                                        minWidth: 0,
                                    }}
                                >
                                    <Schedule
                                        sx={{ fontSize: 14, flexShrink: 0 }}
                                        color="action"
                                    />
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            fontSize: "14px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {formatTimeRemaining(pot.dueDate || "")}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* 하단 영역 - 버튼들 */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleLeavePotClick}
                            disabled={!isCurrentlyParticipating || isLeaving}
                            startIcon={
                                isLeaving ? (
                                    <CircularProgress size={16} />
                                ) : null
                            }
                            sx={{
                                width: 148,
                                height: 56,
                                bgcolor: isCurrentlyParticipating
                                    ? "#f6f6f6"
                                    : "#e0e0e0",
                                color: isCurrentlyParticipating
                                    ? "black"
                                    : "#9e9e9e",
                                border: "none",
                                boxShadow: "none",
                                "&:hover": {
                                    bgcolor: isCurrentlyParticipating
                                        ? "#f6f6f6"
                                        : "#e0e0e0",
                                    color: isCurrentlyParticipating
                                        ? "#909090"
                                        : "#9e9e9e",
                                },
                                "&:disabled": {
                                    backgroundColor: "#e0e0e0",
                                    color: "#9e9e9e",
                                },
                            }}
                        >
                            {isLeaving ? "탈퇴 중..." : "탈퇴하기"}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleJoinPotClick}
                            disabled={
                                isJoining ||
                                formatTimeRemaining(pot.dueDate || "") ===
                                    "마감"
                            }
                            sx={{
                                width: 148,
                                height: 56,
                                backgroundColor: "#7DD952",
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor: "#6BC742",
                                    boxShadow: "none",
                                },
                                bgcolor: isCurrentlyParticipating
                                    ? "#e0e0e0"
                                    : "#7DD952",
                                color: isCurrentlyParticipating
                                    ? "#9e9e9e"
                                    : "black",
                                "&:disabled": {
                                    backgroundColor: "#e0e0e0",
                                    color: "#9e9e9e",
                                },
                            }}
                        >
                            {isJoining ? "참여 중..." : "참여하기"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default PotMarkerPopup;
