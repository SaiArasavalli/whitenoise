import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { onSnapshot, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Game } from 'src/app/interfaces/game';

@Component({
  selector: 'app-game-delete',
  templateUrl: './game-delete.component.html',
  styleUrls: ['./game-delete.component.css'],
})
export class GameDeleteComponent {
  gameId!: string;
  submitting: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}
  async onSubmit() {
    this.gameId = String(this.route.snapshot.paramMap.get('gameId'));
    const gameDocRef = doc(db, 'games', this.gameId);
    await deleteDoc(gameDocRef);
    this.location.back();
    this.submitting = false;
  }

  goBack() {
    this.location.back();
  }
}
