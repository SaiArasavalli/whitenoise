import { Timestamp } from 'firebase/firestore';

export interface Board {
  id: string;
  name: string;
  price: number;
  created: Timestamp;
}
