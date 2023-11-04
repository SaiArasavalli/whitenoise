import { Component } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Customer } from 'src/app/interfaces/customer';
import { Board } from 'src/app/interfaces/board';
import { Game } from 'src/app/interfaces/game';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-game-edit',
  templateUrl: './game-edit.component.html',
  styleUrls: ['./game-edit.component.css'],
})
export class GameEditComponent {
  gameId!: string;
  customers: Customer[] = [];
  boards: Board[] = [];
  submitting: boolean = false;

  gameForm = this.fb.group({
    board: ['', [Validators.required]],
    startTime: ['', [Validators.required]],
    endTime: ['', []],
    players: this.fb.array([]),
    comment: [''],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  async ngOnInit() {
    this.gameId = String(this.route.snapshot.paramMap.get('gameId'));
    const docRef = doc(db, 'games', this.gameId);
    const docSnap = await getDoc(docRef);
    const gameData = docSnap.data() as Game;
    this.gameForm.patchValue(gameData);
    if (gameData['players']) {
      this.setFormPlayers(gameData['players']);
    }

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

  setFormPlayers(players: any[]) {
    if (players) {
      players.forEach((player) => {
        this.players.push(this.fb.group(player));
      });
    }
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
      const gameId = this.gameId;
      const gameData = this.gameForm.value;
      const gameRef = doc(db, 'games', gameId);
      await updateDoc(gameRef, {
        board: gameData.board,
        startTime: gameData.startTime,
        endTime: gameData.endTime,
        players: gameData.players,
        comment: gameData.comment,
      });
      this.location.back();
      this.submitting = false;
    }
  }
}
