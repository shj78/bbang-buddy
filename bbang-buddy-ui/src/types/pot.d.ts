import { Dayjs } from "dayjs";

// 팟 생성 요청 인터페이스
export interface PotCreateRequest {
    title: string;
    description: string;
    maxParticipants: number;
    currentParticipants: number; // 현재 참가자 수 (생성 시 1로 고정)
    category: string;
    address: string;
    latitude: number;
    longitude: number;
    dueDate: string; // ISO 8601 형식 (서버에서 LocalDateTime으로 변환)
}

// CreatePotModal 컴포넌트 Props
export interface CreatePotModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

// 사용자 폼 데이터 인터페이스 (CreatePotModal에서 사용)
export interface PotFormData {
    title: string;
    description: string;
    maxParticipants: number;
    category: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    dueDate: Dayjs | null;
    image: File | null;
    chatRoomUrl?: string | null;
}

export interface PotDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJoinSuccess?: () => void;
    pot?: Pot | null; // 팟 정보
    isParticipating?: boolean; // 이미 참여 중인지 여부
    isAuthenticated?: boolean; // 인증 여부
    formatTimeRemaining?: (dueDate: string) => string;
}

// 서버에서 받아오는(응답용) 팟 데이터 인터페이스
export interface Pot {
    id: string;
    title: string;
    description: string;
    currentParticipants: number;
    maxParticipants: number;
    dueDate: string;
    latitude: number;
    longitude: number;
    imagePath?: string;
    category?: string;
    address?: string;
    chatRoomUrl?: string; // 카카오톡 채팅방 URL
}

// 팟 카드 컴포넌트 Props 인터페이스
export interface PotCardProps {
    pot: Pot;
    formatTimeRemaining: (dueDate: string) => string;
    onCardClick?: (pot: Pot) => void;
}

// 주소와 함께 표시하는 간단한 팟 카드 Props 인터페이스
export interface PotCardWithAddressProps {
    pot: Pot;
    onCardClick?: (pot: Pot) => void;
    onJoinClick?: (pot: Pot) => void;
    buttonText?: string;
    isParticipating?: boolean;
}

export interface SortablePot {
    currentParticipants: number;
    dueDate?: string;
}

export interface PotMarkerMakerProps {
    map: NaverMap | null;
    pots: Pot[];
    setSelectedPot: (pot: Pot) => void;
    onPotMarkerClick: (pot: Pot) => void;
}
