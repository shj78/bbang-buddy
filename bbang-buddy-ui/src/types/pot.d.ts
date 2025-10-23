import { Dayjs } from 'dayjs';

export interface CreatePotModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface PotFormData {
  title: string;
  description: string;
  maxParticipants: number;
  category: string;
  currentParticipants: number;
  address: string;
  latitude: number | null;
  longitude: number | null;
  dueDate: Dayjs | null;
  image?: File | null;
  chatRoomUrl?: string;
}

export interface PotDetailModalProps {
  open: boolean;
  onClose: () => void;
  onJoinSuccess?: () => void;
  pot?: Pot | null;
  isParticipating?: boolean;
  isAuthenticated?: boolean;
  formatTimeRemaining?: (dueDate: string) => string;
}

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
  chatRoomUrl?: string;
}

export interface PotCardProps {
  pot: Pot;
  pageType: 'main' | 'allPot';
  formatTimeRemaining?: (dueDate: string) => string;
  onCardClick: (pot: Pot) => void;
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
