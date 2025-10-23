'use client';

import React from 'react';
import useNotificationStore from '../../store/useNotificationStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Notification } from '../../types/notification';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { readAndRemoveNotification } = useNotificationStore();
  const { user } = useAuthStore();

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    readAndRemoveNotification(notification.id);
  };

  const formatTime = (date: string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return formatDistanceToNow(d, {
      addSuffix: true,
      locale: ko,
    });
  };

  const removeUserIdFromMessage = (message: string) => {
    if (!user?.userId) return message;

    const userPattern = new RegExp(`${user.userId}님이\\s+`, 'g');
    return message.replace(userPattern, '');
  };

  return (
    <Box
      sx={{
        width: '100%',
        p: 1,
        borderRadius: 2,
        backgroundColor: notification.read ? 'transparent' : 'transparent',
        '&:hover': {
          backgroundColor: 'transparent',
        },
        transition: 'background-color 0.2s',
        position: 'relative',
      }}
    >
      {/* X 버튼 */}
      <IconButton
        size="small"
        onClick={handleRemove}
        sx={{
          position: 'absolute',
          top: -1,
          right: 0,
          zIndex: 2,
          margin: 0.6,
          cursor: 'pointer',
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 0.55,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 500,
            color: notification.read ? 'text.secondary' : 'text.primary',
          }}
        >
          {notification.title}팟
        </Typography>
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          mb: 1,
          lineHeight: 1.4,
          fontSize: '0.7rem',
        }}
      >
        {removeUserIdFromMessage(notification.message)}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          color: 'text.disabled',
          fontSize: '0.7rem',
          fontWeight: 'bold',
        }}
      >
        {formatTime(notification.createdAt)}
      </Typography>
    </Box>
  );
};

export default NotificationItem;
