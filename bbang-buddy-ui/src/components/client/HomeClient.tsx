'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import PotArea from '../pot/PotArea';
import { Button } from '@mui/material';
import CreatePotModal from '../pot/CreatePotModal';
import styles from '@/app/page.module.css';
import MapArea from '../map/MapArea';
import { FORM_CONSTANTS } from '../../constants/formConstants';
import { useRequireAuth } from '../../hooks/useRequireAuth';

export default function HomeClient() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { isCheckAuth } = useRequireAuth();
  const handleCreatePotClick = () => {
    if (!isCheckAuth()) return;
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
                backgroundColor: '#7DD952',
                '&:hover': {
                  backgroundColor: '#6BC442',
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
          toast.success('팟이 성공적으로 생성되었습니다!');
        }}
      />
    </div>
  );
}
