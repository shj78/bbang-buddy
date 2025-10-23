import { Box } from '@mui/material';
import PotCardSkeleton from '../pot/PotCardSkeleton';

export default function LoadingSpinner({ count = 3 }: { count?: number }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        gap: 1,
        backgroundColor: 'white',
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <PotCardSkeleton key={index} />
      ))}
    </Box>
  );
}
