import { Timestamp } from 'firebase/firestore';

export interface Menu {
  id: string;
  name: string;
  price: number;
  created: Timestamp;
}
