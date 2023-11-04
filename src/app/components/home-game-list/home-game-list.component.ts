import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Board } from 'src/app/interfaces/board';
import { Customer } from 'src/app/interfaces/customer';
import { Game } from 'src/app/interfaces/game';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home-game-list',
  templateUrl: './home-game-list.component.html',
  styleUrls: ['./home-game-list.component.css'],
})
export class HomeGameListComponent {
  games: Game[] = [];
  customers: Customer[] = [];
  boards: Board[] = [];
  filteredGames: Game[] = [];
  @Input() isAdmin!: boolean;
  loadingGames: boolean = true;
  loadingCustomers: boolean = true;
  loadingBoards: boolean = true;

  searchForm = this.fb.group({
    name: [''],
    payment: [''],
  });

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    this.searchForm.valueChanges.subscribe((formValues) => {
      const name = formValues.name?.toLowerCase().trim() ?? '';
      const payment = formValues.payment?.toLowerCase().trim();
      if (name || payment) {
        this.filteredGames = this.games.filter((game) => {
          const playerNameMatches = game.players?.some(
            (player) =>
              player.name.toLowerCase().startsWith(name) &&
              player.lost &&
              (payment === '' || player.payment.toLowerCase() === payment)
          );
          const paymentMatches =
            payment === '' ||
            game.players?.some(
              (player) => player.payment.toLowerCase() === payment
            );
          return playerNameMatches && paymentMatches;
        });
      } else {
        this.filteredGames = this.games;
      }
    });
  }

  ngOnInit() {
    const today = new Date();

    // Get the start and end timestamps for today
    const startOfToday = Timestamp.fromDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0
      )
    );
    const endOfToday = Timestamp.fromDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
      )
    );
    const q = query(
      collection(db, 'games'),
      orderBy('created', 'desc'),
      where('created', '>=', startOfToday),
      where('created', '<=', endOfToday)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.games = [];
      querySnapshot.forEach((doc) => {
        this.games.push({ id: doc.id, ...doc.data() } as Game);
      });
      this.filteredGames = this.games;
      this.loadingGames = false;
    });

    const q2 = query(collection(db, 'boards'), orderBy('created'));
    const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
      this.boards = [];
      querySnapshot.forEach((doc) => {
        this.boards.push({ id: doc.id, ...doc.data() } as Board);
      });
      this.loadingBoards = false;
    });

    const q3 = query(collection(db, 'customers'), orderBy('name'));
    const unsubscribe3 = onSnapshot(q3, (querySnapshot) => {
      this.customers = [];
      querySnapshot.forEach((doc) => {
        this.customers.push({ id: doc.id, ...doc.data() } as Customer);
      });
      this.loadingCustomers = false;
    });
  }

  calculateTotalAmount(
    boardName: string,
    startTime: string,
    endTime: string
  ): number {
    const board = this.boards.find((board) => board.name === boardName);
    const startTimeObj = new Date(`2000-01-01T${startTime}`).getTime();
    const endTimeObj = new Date(`2000-01-01T${endTime}`).getTime();

    const timeDifferenceInMs = endTimeObj - startTimeObj;
    const totalMinutes = Math.floor(timeDifferenceInMs / (1000 * 60));
    const timeDifferenceInSeconds = Math.floor(timeDifferenceInMs / 1000);
    if (board) {
      return Math.round((board.price / 3600) * timeDifferenceInSeconds);
    }
    return 0;
  }

  calcuateDuration(startTime: string, endTime: string): string {
    const startTimeObj = new Date(`2000-01-01T${startTime}`).getTime();
    const endTimeObj = new Date(`2000-01-01T${endTime}`).getTime();

    const timeDifferenceInMs = endTimeObj - startTimeObj;
    const timeDifferenceInSeconds = Math.floor(timeDifferenceInMs / 1000);

    const hours = Math.floor(timeDifferenceInMs / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifferenceInMs % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor(timeDifferenceInSeconds % 60);

    const formattedDuration = `${this.padNumber(hours)}H : ${this.padNumber(
      minutes
    )}M`;
    return formattedDuration;
  }

  calculateMinutes(startTime: string, endTime: string) {
    const startTimeObj = new Date(`2000-01-01T${startTime}`).getTime();
    const endTimeObj = new Date(`2000-01-01T${endTime}`).getTime();

    const timeDifferenceInMs = endTimeObj - startTimeObj;
    const timeDifferenceInSeconds = Math.floor(timeDifferenceInMs / 1000);
    const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);

    return timeDifferenceInMinutes;
  }

  padNumber(number: number): string {
    return number.toString().padStart(2, '0');
  }

  getPlayerId(playerName: string) {
    const choosenCustomer = this.customers.find(
      (customer) => customer.name.toLowerCase() === playerName.toLowerCase()
    );
    return choosenCustomer?.id;
  }

  parseTimeString(timeString: string): Date {
    // Assuming timeString is in the format "HH:mm" (e.g., "09:30")
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  getFormattedTime(timeString: string): string {
    const dateObject = this.parseTimeString(timeString);
    return this.datePipe.transform(dateObject, 'h:mm a') || '';
  }

  countLostPlayers(players: any[]): number {
    return players.filter((player) => player.lost).length;
  }

  round2(value: number) {
    return Math.round(value);
  }

  isPlayerSub(playerName: string) {
    const player = this.customers.find(
      (customer) => customer.name.toLowerCase() === playerName.toLowerCase()
    );
    return player?.sub;
  }
}
