import {
    Typography,
    Card,
    CardContent,
    Box,
    Stack,
    Button,
} from "@mui/material";
import { LocationOn, Group, Schedule } from "@mui/icons-material";
import Image from "next/image";
import { PotCardWithAddressProps } from "../../types/pot";
import { formatTimeRemaining } from "../../utils/timeUtils";
import { DEFAULT_IMAGE_PATH } from "../../constants/image";

export default function PotCardWithAddress({
    pot,
    onCardClick,
    buttonText,
}: PotCardWithAddressProps) {
    const handleCardClick = () => {
        if (onCardClick) {
            onCardClick(pot);
        }
    };

    const isFullyBooked = pot.currentParticipants >= pot.maxParticipants;
    const isTimeExpired = formatTimeRemaining(pot.dueDate || "") === "마감";
    const isDisabled = isFullyBooked || isTimeExpired;

    return (
        <>
            <Card
                sx={{
                    width: {
                        xs: "100%", // 모바일 (0px+)
                        sm: "100%", // 태블릿 (600px+)
                        md: "100%", // 중간 (900px+)
                        lg: 960, // 데스크톱 (1200px+)
                        xl: 960, // 큰 화면 (1536px+)
                    },
                    height: 168,
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
                        p: 3,
                        height: "100%",
                        "&:last-child": { pb: 3 },
                    }}
                >
                    {/* 좌측 이미지 */}
                    <Box
                        sx={{
                            width: 120,
                            height: 120,
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
                            width={120}
                            height={120}
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
                            justifyContent: "center",
                        }}
                    >
                        <Box
                            sx={{
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                            }}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    fontSize: {
                                        xs: "0.5rem",
                                        sm: "0.6rem",
                                        md: "0.7rem",
                                        lg: "0.8rem",
                                        xl: "0.8rem",
                                    },
                                    pb: "6px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    maxWidth: "100%",
                                }}
                            >
                                {pot.title}
                            </Typography>
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{
                                fontSize: {
                                    xs: "0.35rem",
                                    sm: "0.45rem",
                                    md: "0.65rem",
                                    lg: "0.75rem",
                                    xl: "0.75rem",
                                },
                                fontWeight: 400,
                                color: "#666666",
                                pb: "18px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {pot.description}
                        </Typography>

                        <Stack direction="row" spacing={1.5}>
                            <Box
                                sx={{
                                    fontSize: {
                                        xs: "0.35rem",
                                        sm: "0.45rem",
                                        md: "0.55rem",
                                        lg: "0.65rem",
                                        xl: "0.65rem",
                                    },
                                    fontWeight: 400,
                                    color: "#333333",
                                    display: "flex",
                                    gap: 1, // 자식 요소들 사이 간격 추가
                                }}
                            >
                                <Box
                                    sx={{
                                        display: { sm: "flex" },
                                        alignItems: "center",
                                        gap: 0.3,
                                    }}
                                >
                                    <Group
                                        sx={{ fontSize: 14, color: "#333333" }}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontSize: {
                                                xs: "0.35rem",
                                                sm: "0.45rem",
                                                md: "0.55rem",
                                                lg: "0.65rem",
                                                xl: "0.65rem",
                                            },
                                        }}
                                    >
                                        {pot.currentParticipants}/
                                        {pot.maxParticipants}명
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: { sm: "flex" },
                                        alignItems: "center",
                                        gap: 0.3,
                                    }}
                                >
                                    <Schedule
                                        sx={{ fontSize: 14, color: "#333333" }}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontSize: {
                                                xs: "0.35rem",
                                                sm: "0.45rem",
                                                md: "0.55rem",
                                                lg: "0.65rem",
                                                xl: "0.65rem",
                                            },
                                        }}
                                    >
                                        {formatTimeRemaining(pot.dueDate || "")}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: { sm: "flex" },
                                        alignItems: "center",
                                        gap: 0.3,
                                    }}
                                >
                                    <LocationOn
                                        sx={{ fontSize: 14, color: "#333333" }}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontSize: {
                                                xs: "0.35rem",
                                                sm: "0.45rem",
                                                md: "0.55rem",
                                                lg: "0.65rem",
                                                xl: "0.65rem",
                                            },
                                        }}
                                    >
                                        {pot.address || "주소 정보 없음"}
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Box>

                    {/* 우측 보기 버튼 */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleCardClick}
                            disabled={isDisabled}
                            sx={{
                                width: 96,
                                height: 56,
                                fontSize: "14px",
                                fontWeight: 500,
                                borderRadius: 2,
                                backgroundColor: isDisabled
                                    ? "#e0e0e0"
                                    : "#7dd952",
                                color: isDisabled ? "#9e9e9e" : "black",
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor: isDisabled
                                        ? "#e0e0e0"
                                        : "#6bc142",
                                    boxShadow: isDisabled
                                        ? "none"
                                        : "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
                                },
                                "&:disabled": {
                                    backgroundColor: "#e0e0e0",
                                    color: "#9e9e9e",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            {isFullyBooked
                                ? "마감"
                                : isTimeExpired
                                  ? "마감"
                                  : buttonText || "보기"}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </>
    );
}
