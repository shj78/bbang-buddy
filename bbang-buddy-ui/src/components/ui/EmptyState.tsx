import { Box, Typography } from '@mui/material';
import { SearchOff, Inbox } from '@mui/icons-material';

interface EmptyStateProps {
  type: 'search' | 'list';
  message?: string;
  description?: string;
}

export default function EmptyState({
  type,
  message,
  description,
}: EmptyStateProps) {
  const getDefaults = () => {
    switch (type) {
      case 'search':
        return {
          icon: <SearchOff sx={{ fontSize: 48, color: '#bbb' }} />,
          defaultMessage: '검색 결과가 없습니다',
          defaultDescription: '다른 검색어로 시도해보세요',
        };
      case 'list':
        return {
          icon: <Inbox sx={{ fontSize: 48, color: '#bbb' }} />,
          defaultMessage: '항목이 없습니다',
          defaultDescription: '새로운 항목을 추가해보세요',
        };
    }
  };

  const { icon, defaultMessage, defaultDescription } = getDefaults();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: '200px',
        textAlign: 'center',
        gap: 2,
        p: 4,
      }}
    >
      {icon}

      <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
        {message || defaultMessage}
      </Typography>

      {(description || defaultDescription) && (
        <Typography variant="body2" color="text.disabled">
          {description || defaultDescription}
        </Typography>
      )}
    </Box>
  );
}
