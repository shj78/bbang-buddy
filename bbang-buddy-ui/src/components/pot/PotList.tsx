'use client';

import { useState } from 'react';
import { useMyPots } from '../../hooks/usePots';
import { useAuthStore } from '../../store/useAuthStore';
import PotCard from './PotCard';
import PotDetailModal from './PotDetailModal';
import EmptyState from '../ui/EmptyState';
import { Pot } from '../../types/pot';
import { sortPots } from '../../utils/sortUtils';
import { KeyboardArrowDown } from '@mui/icons-material';
import { Box, FormControl, Select, MenuItem } from '@mui/material';
import {
  sortSelectStyles,
  sortSelectMenuProps,
} from '../../styles/selectStyles';
import Pagination from '@mui/material/Pagination';
import { useMemo } from 'react';

interface PotListProps {
  title?: string;
  pots: Pot[];
  buttonText: string;
  onJoinClick?: (pot: Pot) => void;
  emptyType: 'search' | 'list';
  emptyMessage?: string;
  emptyDescription?: string;
  showSorting?: boolean;
}

type SortType = '0-참여자순' | '1-마감임박순';

const isSortType = (value: string): value is SortType => {
  return value === '0-참여자순' || value === '1-마감임박순';
};

// 페이지 크기
const PAGE_SIZE = 10;

export default function PotList({
  pots,
  buttonText,
  emptyType,
  emptyMessage,
  emptyDescription,
  showSorting = true,
}: PotListProps) {
  const [sortOrder, setSortOrder] = useState('0-참여자순');
  const [currentPage, setCurrentPage] = useState(1);
  const [potDetailModalOpen, setPotDetailModalOpen] = useState(false);
  const [selectedPot, setSelectedPot] = useState<Pot | null>(null);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { myPots } = useMyPots(isAuthenticated);

  const handleCardClick = (pot: Pot) => {
    setSelectedPot(pot);
    setPotDetailModalOpen(true);
  };

  const handlePotDetailModalClose = () => {
    setPotDetailModalOpen(false);
    setSelectedPot(null);
  };

  //? 파라미터 pot || []으로 넘기는 게 코드가 보기 좋지 않다고 생각
  const sortedPots = useMemo(
    () => sortPots(pots || [], sortOrder) as Pot[],
    [pots, sortOrder]
  );

  const totalPages = Math.max(
    1,
    Math.ceil((sortedPots?.length ?? 0) / PAGE_SIZE)
  );

  const paginatedPots = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return sortedPots.slice(startIndex, startIndex + PAGE_SIZE);
  }, [sortedPots, currentPage]);

  const isParticipating =
    !!selectedPot &&
    isAuthenticated &&
    Array.isArray(myPots) &&
    myPots.some((pot) => String(pot.id) === String(selectedPot.id));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: 'white',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '960px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        {showSorting && (
          <FormControl>
            <Select
              value={sortOrder}
              onChange={(e) => {
                if (isSortType(e.target.value)) {
                  setSortOrder(e.target.value);
                }
              }}
              IconComponent={KeyboardArrowDown}
              variant="standard"
              disableUnderline
              sx={sortSelectStyles}
              MenuProps={sortSelectMenuProps}
            >
              <MenuItem value="0-참여자순">참여자순</MenuItem>
              <MenuItem value="1-마감임박순">마감임박순</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>

      {sortedPots.length === 0 ? (
        <EmptyState
          type={emptyType}
          message={emptyMessage}
          description={emptyDescription}
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
            maxWidth: '960px',
            alignItems: 'center',
          }}
        >
          {paginatedPots.map((pot: Pot) => (
            <PotCard
              key={pot.id}
              pot={pot}
              buttonText={buttonText}
              pageType="allPot"
              onJoinClick={handleCardClick}
              onCardClick={handleCardClick}
            />
          ))}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_: unknown, page: number) => setCurrentPage(page)}
            />
          </Box>

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
