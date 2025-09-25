import { useState, useCallback } from "react";
import { useNearPots } from "../../hooks/usePots";
import { useMyPots } from "../../hooks/usePots";
import useLocationStore from "../../store/useLocationStore";
import { useAuthStore } from "../../store/useAuthStore";
import PotCardBasic from "./PotCardBasic";
import PotDetailModal from "./PotDetailModal";
import { Pot } from "../../types/pot";
import { formatTimeRemaining } from "../../utils/timeUtils";
import { Box, Stack, Typography, CircularProgress, Alert } from "@mui/material";

export default function PotArea() {
    const [selectedPot, setSelectedPot] = useState<Pot | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const { currentLocation } = useLocationStore();
    const { pots, potsLoading, potsError } = useNearPots({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
    });

    // 인증 상태 확인
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // 나의 팟 목록 가져오기 (로그인한 경우에만)
    const { myPots } = useMyPots(isAuthenticated);

    // 팟 카드 클릭 핸들러
    const handlePotClick = useCallback((pot: Pot) => {
        setSelectedPot(pot);
        setModalOpen(true);
    }, []);

    // 모달 닫기 핸들러
    const handleModalClose = useCallback(() => {
        setModalOpen(false);
        setSelectedPot(null);
    }, []);

    return (
        <div>
            <Box sx={{ paddingBottom: "24px" }}>
                <Typography variant="h3" sx={{ fontWeight: 500 }}>
                    근처 팟 목록
                </Typography>
            </Box>

            {/* 로딩중 */}
            {potsLoading && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress color="primary" />
                </Box>
            )}

            {/* 에러 */}
            {potsError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    팟 목록을 불러오는데 실패했습니다.
                </Alert>
            )}

            {/* pots 데이터 없음 */}
            {!potsLoading && !potsError && pots.length === 0 && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                        근처에 활성화된 팟이 없습니다.
                    </Typography>
                </Box>
            )}

            {/* pots 데이터 있음 */}
            <Box>
                <Stack spacing={2}>
                    {pots?.map((pot: Pot) => (
                        <PotCardBasic
                            key={pot.id}
                            pot={pot}
                            formatTimeRemaining={formatTimeRemaining}
                            onCardClick={handlePotClick}
                        />
                    ))}
                </Stack>
            </Box>

            {/* 팟 상세 모달 */}
            <PotDetailModal
                open={modalOpen}
                onClose={handleModalClose}
                pot={selectedPot}
                formatTimeRemaining={formatTimeRemaining}
                isParticipating={
                    (isAuthenticated &&
                        myPots?.some(
                            (myPot: Pot) => myPot.id === selectedPot?.id
                        )) ||
                    false
                }
            />
        </div>
    );
}
