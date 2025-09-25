"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";
import { toast } from "sonner";
import { useOnceEffect } from "../../hooks/useOnceEffect";
import PotArea from "../pot/PotArea";
import { Button } from "@mui/material";
import CreatePotModal from "../pot/CreatePotModal";
import styles from "@/app/page.module.css";
import MapArea from "../map/MapArea";
import { FORM_CONSTANTS } from "../../constants/formConstants";

export default function HomeClient() {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useOnceEffect(() => {
        //SSR 대응, SDK 체크
        if (
            typeof window !== "undefined" &&
            window.kakao &&
            window.kakao.maps
        ) {
            window.kakao.maps.load(() => {});
        }
    });

    // 팟만들기 클릭 이벤트
    const handleCreatePotClick = () => {
        if (!isAuthenticated) {
            toast.error("팟을 만들려면 로그인이 필요합니다.");
            router.push("/auth/login");
            return;
        }
        setIsCreateModalOpen(true);
    };

    return (
        <div>
            {/* 팟 지도+리스트 탐색 영역 */}
            <div className={styles.potExplorer}>
                <div className={styles.mapSection}>
                    <MapArea />
                </div>
                <div className={styles.potListPanel}>
                    <div className={styles.potListContent}>
                        <PotArea />
                    </div>
                    <div className={styles.buttonSection}>
                        <Button
                            sx={{
                                height: 56,
                                backgroundColor: "#7DD952",
                                "&:hover": {
                                    backgroundColor: "#6BC442",
                                },
                            }}
                            variant="contained"
                            fullWidth
                            onClick={handleCreatePotClick}
                        >
                            {FORM_CONSTANTS.BUTTON_TEXTS.create}
                        </Button>
                    </div>
                </div>
            </div>

            {/* 팟 만들기 모달 */}
            <CreatePotModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    toast.success("팟이 성공적으로 생성되었습니다!");
                }}
            />
        </div>
    );
}
