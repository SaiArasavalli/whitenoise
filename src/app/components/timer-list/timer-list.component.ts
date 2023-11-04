import { Component } from '@angular/core';
import { query, collection, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Board } from 'src/app/interfaces/board';
import { Customer } from 'src/app/interfaces/customer';

@Component({
  selector: 'app-timer-list',
  templateUrl: './timer-list.component.html',
  styleUrls: ['./timer-list.component.css'],
})
export class TimerListComponent {
  boards: Board[] = [];
  loading: boolean = true;
  ngOnInit() {
    const q = query(collection(db, 'boards'), orderBy('created'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.boards = [];
      querySnapshot.forEach((doc) => {
        this.boards.push({ id: doc.id, ...doc.data() } as Board);
      });
      this.loading = false;
    });
  }
}
