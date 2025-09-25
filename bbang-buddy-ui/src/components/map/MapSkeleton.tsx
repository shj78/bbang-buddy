import { Box, Skeleton } from "@mui/material";

export default function MapSkeleton() {
    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                position: "relative",
                backgroundColor: "#f6f6f6", // 지도 배경색
                borderRadius: 1,
                overflow: "hidden",
            }}
        >
            {/* 지도 배경 */}
            <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation="wave"
                sx={{ backgroundColor: "#f6f6f6" }}
            />

            {/* 지도 컨트롤들 */}
            <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                <Skeleton
                    variant="rectangular"
                    width={120}
                    height={40}
                    sx={{ mb: 1, borderRadius: 1 }}
                />
            </Box>

            {/* 마커들 */}
            <Box sx={{ position: "absolute", top: "20%", left: "10%" }}>
                <Skeleton variant="circular" width={24} height={24} />
            </Box>
            <Box sx={{ position: "absolute", top: "30%", left: "20%" }}>
                <Skeleton variant="circular" width={24} height={24} />
            </Box>
            <Box sx={{ position: "absolute", top: "35%", left: "29%" }}>
                <Skeleton variant="circular" width={24} height={24} />
            </Box>
            <Box sx={{ position: "absolute", top: "40%", left: "10%" }}>
                <Skeleton variant="circular" width={24} height={24} />
            </Box>
            <Box sx={{ position: "absolute", top: "90%", left: "40%" }}>
                <Skeleton variant="circular" width={24} height={24} />
            </Box>
            <Box sx={{ position: "absolute", top: "74%", left: "20%" }}>
                <Skeleton variant="circular" width={24} height={24} />
            </Box>
            <Box sx={{ position: "absolute", top: "60%", left: "30%" }}>
                <Skeleton variant="circular" width={24} height={24} />
            </Box>
            <Box sx={{ position: "absolute", top: "50%", left: "60%" }}>
                <Skeleton variant="circular" width={24} height={24} />
            </Box>
            <Box sx={{ position: "absolute", top: "70%", left: "80%" }}>
                <Skeleton variant="circular" width={24} height={24} />
            </Box>
        </Box>
    );
}
