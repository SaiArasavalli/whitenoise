import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Board } from 'src/app/interfaces/board';

@Component({
  selector: 'app-board-add',
  templateUrl: './board-add.component.html',
  styleUrls: ['./board-add.component.css'],
})
export class BoardAddComponent {
  boardForm = this.fb.group({
    name: ['', [Validators.required]],
    price: ['', [Validators.required]],
  });
  submitting: boolean = false;

  constructor(private fb: FormBuilder, private location: Location) {}

  async onSubmit() {
    if (this.boardForm.valid) {
      this.submitting = true;
      const boardData = this.boardForm.value;
      await addDoc(collection(db, 'boards'), {
        name: boardData.name,
        price: Number(boardData.price),
        created: serverTimestamp(),
      });
      this.boardForm.reset();
      this.location.back();
      this.submitting = false;
    }
  }
}
