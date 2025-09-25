import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PotCreateRequest } from "../types/pot";
import {
    createPot,
    getNearPots,
    getMyPots,
    getAllPots,
    searchPots as searchPotsApi,
} from "../lib/potApi";

/**
 * 🚀 팟 생성 훅 (useMutation 기반)
 * - TanStack Query의 useMutation을 사용하여 팟 생성 상태 관리
 * - 성공 시 관련 쿼리 캐시 무효화하여 최신 데이터 반영
 * - 컴포넌트에서는 이 훅만 사용하면 됨 (API 로직 캡슐화)
 */
export const useCreatePot = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            potData,
            image,
        }: {
            potData: PotCreateRequest;
            image: File | null;
        }) => createPot(potData, image),
        onSuccess: () => {
            // 성공시 자동?으로 관련 쿼리 캐시 무효화하여 최신 데이터 반영
            queryClient.invalidateQueries({ queryKey: ["pots"] });
            queryClient.invalidateQueries({ queryKey: ["myPots"] });
            queryClient.invalidateQueries({ queryKey: ["allPots"] });
        },
        onError: (error) => {
            console.error("❌ 팟 생성 실패:", error);
        },
    });
};

// 근처 pots 가져오기
export const useNearPots = ({
    latitude,
    longitude,
}: {
    latitude: number;
    longitude: number;
}) => {
    const distance = 3; // 기본 반경 3km

    const {
        data: pots,
        isLoading: potsLoading,
        error: potsError,
        refetch: potsRefetch,
    } = useQuery({
        queryKey: ["pots", latitude, longitude],
        queryFn: () => getNearPots(latitude, longitude, distance),
        enabled: !!(latitude && longitude), // 위치 정보가 있을 때만 실행
    });

    return { pots, potsLoading, potsError, refetch: potsRefetch };
};

// 내 pots 가져오기
export const useMyPots = (enabled: boolean = true) => {
    const {
        data: myPots,
        isLoading: myPotsLoading,
        error: myPotsError,
        refetch: myPotsRefetch,
        isRefetching: myPotsIsRefetching,
        isFetching: myPotsIsFetching,
        isStale: myPotsIsStale,
    } = useQuery({
        queryKey: ["myPots"],
        queryFn: getMyPots,
        enabled, // 로그인 상태에 따라 조건부 실행
    });

    return {
        myPots,
        myPotsLoading,
        myPotsError,
        myPotsRefetch,
        myPotsIsRefetching,
        myPotsIsFetching,
        myPotsIsStale,
    };
};

// 전체 pots 가져오기
export const useAllPots = () => {
    const {
        data: allPots,
        isLoading: allPotsLoading,
        error: allPotsError,
        refetch: allPotsRefetch,
    } = useQuery({
        queryKey: ["allPots"],
        queryFn: getAllPots,
    });

    return { allPots, allPotsLoading, allPotsError, allPotsRefetch };
};

// 팟 검색
export const useSearchPots = (keyword: string) => {
    const {
        data: searchResults,
        isLoading: searchPotsLoading,
        error: searchPotsError,
        refetch: searchPotsRefetch,
    } = useQuery({
        queryKey: ["searchPots"],
        queryFn: () => searchPotsApi(keyword),
    });

    return {
        searchPots: searchResults,
        searchPotsLoading,
        searchPotsError,
        searchPotsRefetch,
    };
};
