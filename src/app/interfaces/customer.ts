import { Timestamp } from 'firebase/firestore';

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  sub?: boolean;
  created: Timestamp;
}
