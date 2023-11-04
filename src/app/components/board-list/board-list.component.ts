import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { query, collection, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Board } from 'src/app/interfaces/board';

@Component({
  selector: 'app-board-list',
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.css'],
})
export class BoardListComponent {
  boards: Board[] = [];
  filteredBoards: Board[] = [];

  searchForm = this.fb.group({
    name: [''],
  });

  constructor(private fb: FormBuilder) {
    this.searchForm.get('name')?.valueChanges.subscribe((name) => {
      if (name) {
        this.filteredBoards = this.boards.filter((board) => {
          return board.name.toLowerCase().includes(name.trim().toLowerCase());
        });
      } else {
        this.filteredBoards = this.boards;
      }
    });
  }

  ngOnInit() {
    const q = query(collection(db, 'boards'), orderBy('created', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.boards = [];
      querySnapshot.forEach((doc) => {
        this.boards.push({ id: doc.id, ...doc.data() } as Board);
      });
      this.filteredBoards = this.boards;
    });
  }
}
