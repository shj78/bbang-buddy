import { Skeleton, Box, Card, CardContent } from "@mui/material";

export default function PotCardSkeleton() {
    return (
        <Card
            sx={{
                width: "100%",
                maxWidth: "960px",
                mb: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box display="flex" gap={2}>
                    {/* 이미지 영역 */}
                    <Skeleton
                        variant="rectangular"
                        width={80}
                        height={80}
                        sx={{ borderRadius: 1 }}
                    />

                    {/* 텍스트 영역 */}
                    <Box flex={1}>
                        {/* 제목 */}
                        <Skeleton
                            variant="text"
                            sx={{ fontSize: "1.2rem", mb: 1 }}
                            width="60%"
                        />

                        {/* 설명 라인들 */}
                        <Skeleton
                            variant="text"
                            sx={{ fontSize: "1rem", mb: 0.5 }}
                            width="80%"
                        />
                        <Skeleton
                            variant="text"
                            sx={{ fontSize: "1rem", mb: 0.5 }}
                            width="70%"
                        />

                        {/* 주소/시간 정보 */}
                        <Skeleton
                            variant="text"
                            sx={{ fontSize: "0.9rem" }}
                            width="50%"
                        />
                    </Box>

                    {/* 버튼 영역 */}
                    <Skeleton
                        variant="rectangular"
                        width={80}
                        height={36}
                        sx={{ borderRadius: 1 }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
}
