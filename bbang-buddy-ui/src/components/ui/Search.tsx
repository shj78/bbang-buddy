'use client';

import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton, Button } from '@mui/material';
import {
  DEFAULT_CLEAR_IMAGE_PATH,
  DEFAULT_SEARCH_IMAGE_PATH,
} from '../../constants/image';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../constants/routes';

export default function SearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onSubmit = () => {
    if (search.trim()) {
      router.push(
        `${ROUTES.SEARCH.ROOT}?q=${encodeURIComponent(search.trim())}`
      );
    }
  };

  const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  const clearSearch = () => {
    setSearch('');
  };

  return (
    <TextField
      size="small"
      placeholder="검색어를 입력해주세요"
      value={search}
      onChange={onChangeSearch}
      onKeyDown={onKeyPress}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {search.trim() && (
              <IconButton
                size="small"
                onClick={clearSearch}
                sx={{
                  color: 'black',
                  width: 32,
                  height: 32,
                  minWidth: 32,
                  padding: 0,
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
              >
                <Image
                  src={DEFAULT_CLEAR_IMAGE_PATH}
                  alt="지우기"
                  width={12}
                  height={12}
                  style={{
                    objectFit: 'contain',
                  }}
                />
              </IconButton>
            )}
            <Button
              size="small"
              onClick={onSubmit}
              sx={{
                color: 'black',
                width: 32,
                height: 32,
                minWidth: 32,
                padding: 0,
              }}
            >
              <Image
                src={DEFAULT_SEARCH_IMAGE_PATH}
                alt="검색"
                width={24}
                height={24}
                style={{
                  objectFit: 'contain',
                }}
              />
            </Button>
          </InputAdornment>
        ),
        style: {
          fontSize: '14px',
        },
      }}
      InputLabelProps={{
        style: {
          fontSize: '16px',
        },
      }}
      sx={{
        width: '302px',
        '& .MuiOutlinedInput-root': {
          backgroundColor: '#F6F6F6',
          borderRadius: '7px',
          height: '56px',
          border: 'none',
          borderColor: search.trim() ? 'transparent' : '#7DD952',
          boxShadow: 'none',
          paddingRight: '16px',
          '&::placeholder': {
            fontSize: '14px',
          },
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
          borderColor: search.trim() ? 'transparent' : '#7DD952',
        },
      }}
    />
  );
}
