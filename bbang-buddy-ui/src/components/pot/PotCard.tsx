import Image from 'next/image';
import {
  Typography,
  Card,
  CardContent,
  Box,
  Stack,
  Button,
} from '@mui/material';
import { formatTimeRemaining } from '../../utils/timeUtils';
import { LocationOn, Group, Schedule } from '@mui/icons-material';
import useLocationStore from '../../store/useLocationStore';
import { DEFAULT_IMAGE_PATH } from '../../constants/image';
import { formatDistance } from '../../utils/distanceUtils';
import { FONT_SIZES, FONT_COLORS } from '@/constants/font';
import { PotCardProps } from '../../types/pot';

export default function PotCardBasic({
  pot,
  pageType,
  onCardClick,
  buttonText,
}: PotCardProps) {
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(pot);
    }
  };

  const { currentLocation } = useLocationStore();
  const isFullyBooked = pot.currentParticipants >= pot.maxParticipants;
  const isTimeExpired = formatTimeRemaining(pot.dueDate || '') === '마감';
  const isDisabled = isFullyBooked || isTimeExpired;

  return (
    <Card
      sx={{
        height: pageType === 'allPot' ? 168 : 102,
        width:
          pageType === 'allPot'
            ? {
                xs: '100%',
                sm: '100%',
                md: '100%',
                lg: 960,
                xl: 960,
              }
            : '100%',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
          cursor: 'pointer',
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent
        sx={{
          display: 'flex',
          gap: 2,
          p: pageType === 'allPot' ? 3 : 2,
          height: '100%',
          '&:last-child': { pb: pageType === 'allPot' ? 3 : 2 },
        }}
      >
        {/* 좌측 이미지 */}
        <Box
          sx={{
            backgroundColor: '#f5f5f5',
            borderRadius: 1,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Image
            src={pot?.imagePath ? `/${pot.imagePath}` : DEFAULT_IMAGE_PATH}
            width={pageType === 'allPot' ? 120 : 56}
            height={pageType === 'allPot' ? 120 : 56}
            alt={pot?.title || '팟 이미지'}
            style={{
              objectFit: 'cover',
              borderRadius: '10%',
            }}
            priority={true}
          />
        </Box>

        {/* 우측 콘텐츠 */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 0.5,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontSize: FONT_SIZES.title,
                  pb: pageType === 'allPot' ? '6px' : '0px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 'calc(100% - 30px)',
                }}
              >
                {pot.title}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: FONT_SIZES.body,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {pot.description}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} sx={{ fontSize: '12px' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.3,
              }}
            >
              <Group sx={{ fontSize: FONT_SIZES.body }} color="action" />
              <Typography variant="body2" sx={{ fontSize: FONT_SIZES.body }}>
                {pot.currentParticipants}/{pot.maxParticipants}명
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.3,
              }}
            >
              <Schedule sx={{ fontSize: FONT_SIZES.body }} color="action" />
              <Typography variant="body2" sx={{ fontSize: FONT_SIZES.body }}>
                {formatTimeRemaining(pot.dueDate || '')}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.3,
              }}
            >
              <LocationOn sx={{ fontSize: FONT_SIZES.body }} />
              <Typography variant="body2" sx={{ fontSize: FONT_SIZES.body }}>
                {pageType === 'allPot' && (pot.address || '주소 정보 없음')}
                {pageType === 'main' &&
                  formatDistance(
                    pot.latitude,
                    pot.longitude,
                    currentLocation.latitude,
                    currentLocation.longitude
                  )}
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          {pageType === 'allPot' && (
            <Button
              variant="contained"
              onClick={handleCardClick}
              disabled={isDisabled}
              sx={{
                width: 96,
                height: 56,
                fontSize: '14px',
                fontWeight: 500,
                borderRadius: 2,
                backgroundColor: isDisabled ? '#e0e0e0' : '#7dd952',
                color: isDisabled ? '#9e9e9e' : 'black',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: isDisabled ? '#e0e0e0' : '#6bc142',
                  boxShadow: isDisabled
                    ? 'none'
                    : '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
                },
                '&:disabled': {
                  backgroundColor: '#e0e0e0',
                  color: '#9e9e9e',
                  boxShadow: 'none',
                },
              }}
            >
              {isFullyBooked
                ? '마감'
                : isTimeExpired
                  ? '마감'
                  : buttonText || '보기'}
            </Button>
          )}
          {pageType === 'main' && (
            <Typography
              sx={{
                fontSize: FONT_SIZES.body,
                color: (() => {
                  const remain = pot.maxParticipants - pot.currentParticipants;
                  const remainingTime = formatTimeRemaining(pot.dueDate || '');
                  if (remainingTime === '마감' || remain === 0) {
                    return FONT_COLORS.closed;
                  } else if (remain === 1) {
                    return FONT_COLORS.closedSoon;
                  } else {
                    return FONT_COLORS.inProgress;
                  }
                })(),
              }}
            >
              ⦁
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
