import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  message = '데이터를 불러오는 중 오류가 발생했습니다.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4,
        width: '100%',
      }}
    >
      <Alert
        severity="error"
        sx={{ maxWidth: '480px' }}
        action={
          onRetry && (
            <Button
              color="inherit"
              size="small"
              onClick={onRetry}
              startIcon={<Refresh />}
            >
              다시 시도
            </Button>
          )
        }
      >
        <AlertTitle>오류</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
}
