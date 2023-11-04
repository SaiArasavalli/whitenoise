import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Board } from 'src/app/interfaces/board';

@Component({
  selector: 'app-board-delete',
  templateUrl: './board-delete.component.html',
  styleUrls: ['./board-delete.component.css'],
})
export class BoardDeleteComponent {
  boardId!: string;
  submitting: boolean = false;

  constructor(private route: ActivatedRoute, private location: Location) {}

  async onSubmit() {
    this.submitting = true;
    this.boardId = String(this.route.snapshot.paramMap.get('boardId'));
    const boardId = this.boardId;
    const boardDocRef = doc(db, 'boards', boardId);
    await deleteDoc(boardDocRef);
    this.location.back();
    this.submitting = false;
  }

  goBack() {
    this.location.back();
  }
}
