import { Timestamp } from 'firebase/firestore';

export interface Game {
  id: string;
  board: string;
  startTime: string;
  endTime?: string;
  players?: { name: string; lost: boolean; payment: string }[];
  comment?: string;
  created: Timestamp;
}
