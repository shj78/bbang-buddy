"use client";

import { useState } from "react";
import { useMyPots } from "../../hooks/usePots";
import { useAuthStore } from "../../store/useAuthStore";
import PotCardWithAddress from "./PotCardWithAddress";
import PotDetailModal from "./PotDetailModal";
import EmptyState from "../ui/EmptyState";
import { Pot } from "../../types/pot";
import { sortPots } from "../../utils/sortUtils";
import { KeyboardArrowDown } from "@mui/icons-material";
import {
    Box,
    FormControl,
    Select,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";
import {
    sortSelectStyles,
    sortSelectMenuProps,
} from "../../styles/selectStyles";

interface PotListProps {
    title?: string;
    pots: Pot[];
    buttonText: string;
    onJoinClick?: (pot: Pot) => void;
    emptyType: "search" | "list";
    emptyMessage?: string;
    emptyDescription?: string;
    isShowSorting?: boolean;
}

export default function PotList({
    pots,
    buttonText,
    emptyType,
    emptyMessage,
    emptyDescription,
    isShowSorting = true,
}: PotListProps) {
    const [sortOrder, setSortOrder] = useState("참여자순");
    const [potDetailModalOpen, setPotDetailModalOpen] = useState(false);
    const [selectedPot, setSelectedPot] = useState<Pot | null>(null);

    // 인증 상태 확인
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // 나의 팟 목록 가져오기 (로그인한 경우에만)
    const { myPots } = useMyPots(isAuthenticated);

    const handleSortChange = (event: SelectChangeEvent<string>) => {
        setSortOrder(event.target.value);
    };

    // useCallback 적용 시 성능 -3
    const handleCardClick = (pot: Pot) => {
        setSelectedPot(pot);
        setPotDetailModalOpen(true);
    };

    // useCallback 적용 시 성능 -3
    const handlePotDetailModalClose = () => {
        setPotDetailModalOpen(false);
        setSelectedPot(null);
    };

    // 단순 계산이라 useMemo 적용 시 성능 -3
    const sortedPots = sortPots(pots || [], sortOrder) as Pot[];

    const isParticipating =
        !!selectedPot &&
        isAuthenticated &&
        Array.isArray(myPots) &&
        myPots.some((pot) => String(pot.id) === String(selectedPot.id));

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
                backgroundColor: "white",
            }}
        >
            {/* 헤더 */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "960px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                {isShowSorting && (
                    <FormControl>
                        <Select
                            value={sortOrder}
                            onChange={handleSortChange}
                            IconComponent={KeyboardArrowDown}
                            variant="standard"
                            disableUnderline
                            sx={sortSelectStyles}
                            MenuProps={sortSelectMenuProps}
                        >
                            <MenuItem value="참여자순">참여자순</MenuItem>
                            <MenuItem value="마감임박순">마감임박순</MenuItem>
                        </Select>
                    </FormControl>
                )}
            </Box>

            {/* 빈 상태 */}
            {sortedPots.length === 0 ? (
                <EmptyState
                    type={emptyType}
                    message={emptyMessage}
                    description={emptyDescription}
                />
            ) : (
                /* 팟 목록 */
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        width: "100%",
                        maxWidth: "960px",
                        alignItems: "center",
                    }}
                >
                    {sortedPots.map((pot: Pot) => (
                        <PotCardWithAddress
                            key={pot.id}
                            pot={pot}
                            buttonText={buttonText}
                            onJoinClick={handleCardClick}
                            onCardClick={handleCardClick}
                        />
                    ))}

                    <PotDetailModal
                        open={potDetailModalOpen}
                        onClose={handlePotDetailModalClose}
                        pot={selectedPot}
                        isParticipating={isParticipating}
                        isAuthenticated={isAuthenticated}
                    />
                </Box>
            )}
        </Box>
    );
}
