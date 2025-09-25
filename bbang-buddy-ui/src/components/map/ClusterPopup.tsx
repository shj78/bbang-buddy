import { useEffect, useMemo } from "react";
import { formatTimeRemaining } from "../../utils/timeUtils";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Pot } from "../../types/pot";

// 클러스터 팝업 컴포넌트
export interface ClusterPopupProps {
    isOpen: boolean;
    onClose: () => void;
    clusterPots: Pot[];
    onPotClick: (pot: Pot) => void;
}

export const ClusterPopup = ({
    open,
    onClose,
    clusterPots,
    onPotClick,
}: ClusterPopupProps) => {
    useEffect(() => {
        if (!open) return;

        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscKey);

        return () => {
            document.removeEventListener("keydown", handleEscKey);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // 큰 차이는 아니더라도 소폭으로 FCP, Speed Index 개선되었음, 하지만 소폭으로 LCP나 TBT는 낮아짐
    const { activePots, expiredPots } = useMemo(() => {
        const active: Pot[] = [];
        const expired: Pot[] = [];

        clusterPots.forEach((pot) => {
            const timeStatus = formatTimeRemaining(pot.dueDate);

            if (timeStatus === "마감") {
                expired.push(pot);
            } else {
                active.push(pot);
            }
        });

        return { activePots: active, expiredPots: expired };
    }, [clusterPots]);

    if (!open) return null;

    return (
        <>
            {/* 배경 오버레이 */}
            <Box
                onClick={onClose}
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999,
                }}
            />
            {/* 팝업 내용 */}
            <Box
                onClick={(e) => e.stopPropagation()} // 팝업 내부 클릭 시 닫히지 않도록
                sx={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1000,
                    bgcolor: "white",
                    borderRadius: 3,
                    boxShadow: 3,
                    p: 2,
                    maxWidth: 400,
                    maxHeight: 500,
                    overflow: "auto",
                }}
            >
                {activePots.length > 0 && (
                    <>
                        <Typography
                            variant="subtitle2"
                            color="primary"
                            sx={{ fontSize: "0.8rem" }}
                        >
                            진행중인 팟
                        </Typography>
                        <List dense>
                            {activePots.map((pot) => (
                                <ListItem
                                    key={pot.id}
                                    component="div"
                                    onClick={() => onPotClick(pot)}
                                    sx={{
                                        borderLeft: "3px solid #e0e0e0",
                                        borderRadius: 1,
                                        cursor: "pointer",
                                        "&:hover": { bgcolor: "#f5f5f5" },
                                    }}
                                >
                                    <ListItemText
                                        sx={{
                                            "& .MuiListItemText-primary": {
                                                fontSize: "0.8rem",
                                            },
                                            "& .MuiListItemText-secondary": {
                                                fontSize: "0.6rem",
                                            },
                                        }}
                                        primary={pot.title}
                                        secondary={`${pot.currentParticipants}/${pot.maxParticipants}명 • ${pot.address || "주소 없음"}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}

                {expiredPots.length > 0 && (
                    <>
                        <Typography
                            variant="subtitle2"
                            color="black"
                            sx={{ fontSize: "0.8rem" }}
                        >
                            마감된 팟
                        </Typography>
                        <List dense>
                            {expiredPots.map((pot) => (
                                <ListItem
                                    key={pot.id}
                                    component="div"
                                    onClick={() => onPotClick(pot)}
                                    sx={{
                                        borderLeft: "3px solid #e0e0e0",
                                        borderRadius: 1,
                                        opacity: 0.6,
                                        cursor: "pointer",
                                        "&:hover": { bgcolor: "#f5f5f5" },
                                    }}
                                >
                                    <ListItemText
                                        sx={{
                                            "& .MuiListItemText-primary": {
                                                fontSize: "0.8rem",
                                            },
                                            "& .MuiListItemText-secondary": {
                                                fontSize: "0.6rem",
                                            },
                                        }}
                                        primary={pot.title}
                                        secondary={`${pot.currentParticipants}/${pot.maxParticipants}명 • ${pot.address || "주소 없음"}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}
            </Box>
        </>
    );
};
