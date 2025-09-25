import Image from "next/image";
import { useCallback } from "react";
import useLocationStore from "../../store/useLocationStore";
import { PotCardProps } from "../../types/pot";
import { DEFAULT_IMAGE_PATH } from "../../constants/image";
import { formatTimeRemaining } from "../../utils/timeUtils";
import { formatDistance } from "../../utils/distanceUtils";
import { Typography, Card, CardContent, Box, Stack } from "@mui/material";
import { LocationOn, Group, Schedule } from "@mui/icons-material";

const FONT_SIZES = {
    title: {
        xs: "0.5rem",
        sm: "0.6rem",
        md: "0.7rem",
        lg: "0.8rem",
        xl: "0.8rem",
    },
    body: {
        xs: "0.35rem",
        sm: "0.45rem",
        md: "0.65rem",
        lg: "0.75rem",
        xl: "0.75rem",
    },
};

export default function PotCardBasic({ pot, onCardClick }: PotCardProps) {
    const { currentLocation } = useLocationStore();

    const handleCardClick = useCallback(() => {
        if (onCardClick) {
            onCardClick(pot);
        }
    }, [onCardClick, pot]);

    return (
        <Card
            sx={{
                height: 102, // 높이 고정
                cursor: onCardClick ? "pointer" : "default",
                transition: "all 0.2s ease",
                "&:hover": onCardClick
                    ? {
                          transform: "translateY(-2px)",
                          boxShadow: 3,
                      }
                    : {},
            }}
            onClick={handleCardClick}
        >
            <CardContent
                sx={{
                    display: "flex",
                    gap: 2,
                    p: 2,
                    height: "100%", // 전체 높이 사용
                    "&:last-child": { pb: 2 }, // MUI 기본 패딩 오버라이드
                }}
            >
                {/* 좌측 이미지 */}
                <Box
                    sx={{
                        width: 70,
                        height: 70,
                        backgroundColor: "#f5f5f5",
                        borderRadius: 1,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    <Image
                        src={
                            pot?.imagePath
                                ? `/${pot.imagePath}`
                                : DEFAULT_IMAGE_PATH
                        }
                        width={56}
                        height={56}
                        alt={pot?.title || "팟 이미지"}
                        style={{
                            objectFit: "cover",
                            borderRadius: "10%",
                        }}
                    />
                </Box>

                {/* 우측 콘텐츠 */}
                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between", // 콘텐츠를 위아래로 분산
                    }}
                >
                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                mb: 0.5,
                            }}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    fontSize: FONT_SIZES.title,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    maxWidth: "calc(100% - 30px)",
                                }}
                            >
                                {pot.title}
                            </Typography>
                        </Box>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 1,
                                fontSize: FONT_SIZES.body,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {pot.description}
                        </Typography>
                    </Box>

                    <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{ fontSize: "12px" }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.3,
                            }}
                        >
                            <Group
                                sx={{ fontSize: FONT_SIZES.body }}
                                color="action"
                            />
                            <Typography
                                variant="body2"
                                sx={{ fontSize: FONT_SIZES.body }}
                            >
                                {pot.currentParticipants}/{pot.maxParticipants}
                                명
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.3,
                            }}
                        >
                            <Schedule
                                sx={{ fontSize: FONT_SIZES.body }}
                                color="action"
                            />
                            <Typography
                                variant="body2"
                                sx={{ fontSize: FONT_SIZES.body }}
                            >
                                {formatTimeRemaining(pot.dueDate || "")}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.3,
                            }}
                        >
                            <LocationOn
                                sx={{ fontSize: FONT_SIZES.body }}
                                color="action"
                            />
                            <Typography
                                variant="body2"
                                sx={{ fontSize: FONT_SIZES.body }}
                            >
                                {formatDistance(
                                    pot.latitude,
                                    pot.longitude,
                                    currentLocation.latitude,
                                    currentLocation.longitude
                                )}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center", // 세로 중앙 정렬
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "16px",
                            color: (() => {
                                const remain =
                                    pot.maxParticipants -
                                    pot.currentParticipants;
                                const remainingTime = formatTimeRemaining(
                                    pot.dueDate || ""
                                );

                                if (remainingTime === "마감") {
                                    return "#909090"; // 마감된 팟 - 회색
                                } else if (remain === 1) {
                                    return "#ff4444"; // 1명 남은 팟 - 빨간색
                                } else {
                                    return "#7dd952"; // 기본 초록색
                                }
                            })(),
                        }}
                    >
                        ⦁
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}
