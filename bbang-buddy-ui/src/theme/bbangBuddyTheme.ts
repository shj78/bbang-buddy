import { createTheme } from '@mui/material/styles';

const brandColors = {
  primary: {
    main: '#7DD952',
    light: '#9AE66E',
    dark: '#5CB03A',
  },
  secondary: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },
  third: {
    main: 'white',
  },
  background: {
    default: '#FFFFFF',
    paper: '#FFFFFF',
  },
};

export const bbangBuddyTheme = createTheme({
  palette: {
    primary: brandColors.primary,
    secondary: brandColors.secondary,
    background: brandColors.background,
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },

  typography: {
    fontFamily: ['"Noto Sans"', '"Noto Sans KR"'].join(','),

    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#333333',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#333333',
    },
    h3: {
      fontSize: '1.0rem',
      fontWeight: 400,
      color: '#000000',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#333333',
    },
    h5: {
      fontSize: '1.2rem',
      fontWeight: 600,
      color: '#333333',
    },
    h6: {
      fontSize: '1.0rem',
      fontWeight: 400,
      color: '#000000',
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#F6F6F6',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
  },
});

export default bbangBuddyTheme;
