'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import useNotificationStore from '../../store/useNotificationStore';
import { Badge, Popover, Button } from '@mui/material';
import NotificationDropdown from './NotificationDropdown';
import { DEFAULT_NOTIFICATION_IMAGE_PATH } from '../../constants/image';

function NotificationBotton() {
  const { unreadCount } = useNotificationStore();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Button
          onClick={handleClick}
          sx={{
            backgroundColor: '#f6f6f6',
            width: 56,
            height: 56,
            padding: 0,
            position: 'relative',
            '&:hover': {
              backgroundColor: '#d0d0d0',
            },
          }}
        >
          <Badge
            badgeContent={unreadCount}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#7DD952',
                color: '#000',
                borderRadius: '50%',
                minWidth: 20,
                height: 20,
                fontWeight: 'bold',
                fontSize: 12,
                boxShadow: '0 0 0 1px #fff',
              },
            }}
            showZero={false}
          >
            <Image
              src={DEFAULT_NOTIFICATION_IMAGE_PATH}
              alt="알림"
              width={24}
              height={24}
              style={{
                objectFit: 'contain',
              }}
            />
          </Badge>
        </Button>
      </div>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 350,
            maxHeight: 400,
            mt: 1,
            borderRadius: 4,
          },
        }}
      >
        <NotificationDropdown />
      </Popover>
    </>
  );
}

export default NotificationBotton;
