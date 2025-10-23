export const getTextFieldStyles = (
  errorCondition?: boolean,
  successCondition?: boolean
) => ({
  mb: 3,
  '& .MuiOutlinedInput-root': {
    bgcolor: '#f6f6f6',
    '& fieldset': {
      border: errorCondition
        ? '2px solid #f44336'
        : successCondition
          ? '2px solid #4caf50'
          : '2px solid transparent',
      transition: 'none',
    },
    '&:hover fieldset': {
      border: errorCondition
        ? '2px solid #f44336'
        : successCondition
          ? '2px solid #4caf50'
          : '2px solid transparent',
    },
    '&.Mui-focused fieldset': {
      border: errorCondition
        ? '2px solid #f44336'
        : successCondition
          ? '2px solid #4caf50'
          : '2px solid #7DD952',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#909090',
    '&.Mui-focused': {
      color: errorCondition
        ? '#f44336'
        : successCondition
          ? '#4caf50'
          : '#7DD952',
    },
  },
});

export const getBorderlessFieldStyles = () => ({
  '& .MuiOutlinedInput-root': {
    bgcolor: '#f6f6f6',
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
    '&.Mui-disabled': {
      '& fieldset': {
        border: 'none',
      },
    },
  },
  '& .MuiInputLabel-root': {
    color: '#909090',
    '&.Mui-focused': {
      color: '#7DD952',
    },
    '&.Mui-disabled': {
      color: '#333 !important',
    },
  },
  '& .MuiInputBase-input': {
    '&.Mui-disabled': {
      color: '#333 !important',
      WebkitTextFillColor: '#333 !important',
    },
  },
  '& .MuiInputBase-root': {
    '&[readonly]': {
      pointerEvents: 'none',
    },
  },
});

export const getReadOnlyFieldStyles = () => ({
  ...getBorderlessFieldStyles(),
  '& .MuiInputBase-root': {
    pointerEvents: 'none',
  },
  '& .MuiInputLabel-root': {
    '&.Mui-disabled': {
      color: '#909090 !important',
    },
  },
  '& .MuiInputBase-input': {
    '&.Mui-disabled': {
      color: '#333 !important',
      WebkitTextFillColor: '#333 !important',
      fontSize: '14px!important',
    },
  },
});

export const getBasicFieldStyles = () => getTextFieldStyles();

export const getReadOnlyDateTimePickerStyles = () => ({
  borderRadius: '6px',
  bgcolor: '#f6f6f6',
  pointerEvents: 'none',
  '& .MuiOutlinedInput-root': {
    bgcolor: '#f6f6f6 !important',
    border: 'none !important',
    borderRadius: '4px !important',
    '& fieldset': {
      display: 'none !important',
    },
    '&:hover': {
      border: 'none !important',
      '& fieldset': {
        display: 'none !important',
      },
    },
    '&.Mui-focused': {
      border: '2px solid #7DD952 !important',
      '& fieldset': {
        display: 'none !important',
      },
    },
    '&.Mui-disabled': {
      border: 'none !important',
      '& fieldset': {
        display: 'none !important',
      },
    },
  },
  '& fieldset': {
    display: 'none !important',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    display: 'none !important',
  },
  '& .MuiInputLabel-root': {
    color: '#909090 !important',
    '&.Mui-focused': {
      color: '#7DD952 !important',
    },
  },
  '& .MuiInputBase-input': {
    color: '#333',
    padding: '16.5px 14px',
  },
  '& .MuiInputAdornment-root': {
    color: '#909090',
    display: 'none !important',
  },
  '& .MuiButton-root': {
    display: 'none !important',
  },
  '& .MuiIconButton-root': {
    display: 'none !important',
  },
});
