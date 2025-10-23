import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PotFormData } from '../types/pot';
import {
  createPot,
  getNearPots,
  getMyPots,
  getAllPots,
  searchPots as searchPotsApi,
} from '../lib/potApi';
import { toast } from 'sonner';

export const useCreatePot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      potData,
      image,
    }: {
      potData: PotFormData;
      image: File | null;
    }) => createPot(potData, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pots'] });
      queryClient.invalidateQueries({ queryKey: ['myPots'] });
      queryClient.invalidateQueries({ queryKey: ['allPots'] });
    },
    onError: (error) => {
      toast.error(`팟 생성에 실패했습니다.: ${error}`);
    },
  });
};

export const useNearPots = ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  const distance = 3;

  const {
    data: pots,
    isLoading: potsLoading,
    error: potsError,
    refetch: potsRefetch,
  } = useQuery({
    queryKey: ['pots', latitude, longitude],
    staleTime: 1000 * 60 * 5,
    retry: 3,
    queryFn: () => getNearPots(latitude, longitude, distance),
    enabled: !!(latitude && longitude),
  });

  return { pots, potsLoading, potsError, potsRefetch };
};

export const useMyPots = (enabled: boolean = true) => {
  const {
    data: myPots,
    isLoading: myPotsLoading,
    error: myPotsError,
    refetch: myPotsRefetch,
  } = useQuery({
    queryKey: ['myPots'],
    queryFn: getMyPots,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    enabled,
  });

  return {
    myPots,
    myPotsLoading,
    myPotsError,
    myPotsRefetch,
  };
};

export const useAllPots = () => {
  const {
    data: allPots,
    isLoading: allPotsLoading,
    error: allPotsError,
    refetch: allPotsRefetch,
  } = useQuery({
    queryKey: ['allPots'],
    queryFn: getAllPots,
    staleTime: 1000 * 60 * 5,
    retry: 3,
  });

  return { allPots, allPotsLoading, allPotsError, allPotsRefetch };
};

export const useSearchPots = (keyword: string) => {
  const {
    data: searchResults,
    isLoading: searchPotsLoading,
    error: searchPotsError,
    refetch: searchPotsRefetch,
  } = useQuery({
    queryKey: ['searchPots'],
    queryFn: () => searchPotsApi(keyword),
    enabled: !!keyword,
    staleTime: 0,
  });

  return {
    searchPots: searchResults,
    searchPotsLoading,
    searchPotsError,
    searchPotsRefetch,
  };
};
