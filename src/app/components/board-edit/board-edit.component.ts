import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Board } from 'src/app/interfaces/board';
import { Customer } from 'src/app/interfaces/customer';

@Component({
  selector: 'app-board-edit',
  templateUrl: './board-edit.component.html',
  styleUrls: ['./board-edit.component.css'],
})
export class BoardEditComponent {
  boardId!: string;
  submitting: boolean = false;
  loading: boolean = true;

  boardForm = this.fb.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.maxLength(10)]],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  async ngOnInit() {
    this.boardId = String(this.route.snapshot.paramMap.get('boardId'));
    const docRef = doc(db, 'boards', this.boardId);
    const docSnap = await getDoc(docRef);
    const boardData = docSnap.data() as Board;
    this.boardForm.patchValue(boardData);
    this.loading = false;
  }

  async onSubmit() {
    if (this.boardForm.valid) {
      this.submitting = true;
      const updatedBoardData = this.boardForm.value;
      const boardId = this.boardId;
      const boardDocRef = doc(db, 'boards', boardId);
      await updateDoc(boardDocRef, {
        name: updatedBoardData.name,
        price: updatedBoardData.price,
      });
      this.location.back();
      this.submitting = false;
    }
  }
}
