import { Component } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import {
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Customer } from 'src/app/interfaces/customer';
import { Board } from 'src/app/interfaces/board';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-game-add',
  templateUrl: './game-add.component.html',
  styleUrls: ['./game-add.component.css'],
})
export class GameAddComponent {
  customers: Customer[] = [];
  boards: Board[] = [];
  submitting: boolean = false;

  gameForm = this.fb.group({
    board: ['', [Validators.required]],
    startTime: ['', [Validators.required]],
    endTime: ['', []],
    players: this.fb.array([]),
    created: [''],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    const q = query(collection(db, 'customers'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.customers = [];
      querySnapshot.forEach((doc) => {
        this.customers.push({ id: doc.id, ...doc.data() } as Customer);
      });
    });

    const q2 = query(collection(db, 'boards'), orderBy('created'));
    const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
      this.boards = [];
      querySnapshot.forEach((doc) => {
        this.boards.push({ id: doc.id, ...doc.data() } as Board);
      });
    });
  }

  get players() {
    return this.gameForm.get('players') as FormArray;
  }

  addItems() {
    this.players.push(
      this.fb.group({ name: [''], lost: false, payment: [''] })
    );
  }

  removeItem(index: number) {
    this.players.removeAt(index);
  }

  async onSubmit() {
    if (this.gameForm.valid) {
      this.submitting = true;
      const gameData = this.gameForm.value;
      await addDoc(collection(db, 'games'), {
        board: gameData.board,
        startTime: gameData.startTime,
        endTime: gameData.endTime,
        players: gameData.players,
        created: Timestamp.fromDate(new Date(gameData.created!)),
      });
      this.gameForm = this.fb.group({
        board: ['', [Validators.required]],
        startTime: ['', [Validators.required]],
        endTime: ['', []],
        players: this.fb.array([]),
        created: [''],
      });
      this.submitting = false;
      this.location.back();
    }
  }
}
