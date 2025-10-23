import { SortablePot } from '../types/pot';
import { getTimeRemainingInMinutes } from './timeUtils';

const getDeadlinePriority = (timeA: number, timeB: number): number => {
  if (timeA === -1 && timeB === -1) return 0;
  if (timeA === -1) return 1;
  if (timeB === -1) return -1;

  if (timeA <= 0 && timeB <= 0) return 0;
  if (timeA <= 0) return 1;
  if (timeB <= 0) return -1;

  return 0;
};

export const sortPots = (
  pots: SortablePot[],
  sortOrder: string
): SortablePot[] => {
  return [...pots].sort((a, b) => {
    const timeA = getTimeRemainingInMinutes(a.dueDate || '');
    const timeB = getTimeRemainingInMinutes(b.dueDate || '');

    const deadlinePriority = getDeadlinePriority(timeA, timeB);
    if (deadlinePriority !== 0) return deadlinePriority;

    switch (sortOrder) {
      case '참여자순':
        return b.currentParticipants - a.currentParticipants;
      case '마감임박순':
        return timeA - timeB;
      default:
        return 0;
    }
  });
};
