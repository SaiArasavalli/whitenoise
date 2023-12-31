import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  where,
} from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Board } from 'src/app/interfaces/board';
import { Customer } from 'src/app/interfaces/customer';
import { Game } from 'src/app/interfaces/game';
import { Order } from 'src/app/interfaces/order';

@Component({
  selector: 'app-calci',
  templateUrl: './calci.component.html',
  styleUrls: ['./calci.component.css'],
})
export class CalciComponent {
  customers: Customer[] = [];
  boards: Board[] = [];
  subCustomers: Customer[] = [];
  nonSubCustomers: Customer[] = [];
  games: Game[] = [];
  orders: Order[] = [];
  orderSum: number = 0;
  subgameSum: number = 0;
  nonSubgameSum: number = 0;
  orderSubmitting: boolean = false;

  filteredData: any = [];

  gameForm = this.fb.group({
    player: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  gamePlayerForm = this.fb.group({
    player: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  orderForm = this.fb.group({
    player: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  filterForm = this.fb.group({
    billType: ['', Validators.required],
    member: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const q = query(collection(db, 'customers'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.customers = [];
      querySnapshot.forEach((doc) => {
        this.customers.push({ id: doc.id, ...doc.data() } as Customer);
      });
      this.subCustomers = this.customers.filter(
        (customer) => customer.sub == true
      );
      this.nonSubCustomers = this.customers.filter(
        (customer) => customer.sub == false
      );
    });

    const q2 = query(collection(db, 'games'), orderBy('created', 'desc'));
    const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
      this.games = [];
      querySnapshot.forEach((doc) => {
        this.games.push({ id: doc.id, ...doc.data() } as Game);
      });
    });

    const q3 = query(collection(db, 'orders'), orderBy('created', 'desc'));
    const unsubscribe3 = onSnapshot(q3, (querySnapshot) => {
      this.orders = [];
      querySnapshot.forEach((doc) => {
        this.orders.push({ id: doc.id, ...doc.data() } as Order);
      });
    });

    const q4 = query(collection(db, 'boards'), orderBy('created'));
    const unsubscribe4 = onSnapshot(q4, (querySnapshot) => {
      this.boards = [];
      querySnapshot.forEach((doc) => {
        this.boards.push({ id: doc.id, ...doc.data() } as Board);
      });
    });
  }

  calculateMinutes(startTime: string, endTime: string) {
    const startTimeObj = new Date(`2000-01-01T${startTime}`).getTime();
    const endTimeObj = new Date(`2000-01-01T${endTime}`).getTime();

    const timeDifferenceInMs = endTimeObj - startTimeObj;
    const timeDifferenceInSeconds = Math.floor(timeDifferenceInMs / 1000);
    const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);

    return timeDifferenceInMinutes;
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

  countLostPlayers(players: any[]): number {
    return players.filter((player) => player.lost).length;
  }

  round(value: number) {
    return Math.round(value);
  }

  gameAmount() {
    this.nonSubgameSum = 0;

    const gamePlayer = this.gamePlayerForm.value.player;
    console.log(gamePlayer);

    const startDate = this.gamePlayerForm.value.startDate
      ? new Date(this.gamePlayerForm.value.startDate)
      : null;
    const endDate = this.gamePlayerForm.value.endDate
      ? new Date(this.gamePlayerForm.value.endDate)
      : null;

    if (gamePlayer && (!startDate || !endDate)) {
      this.games.forEach((game) => {
        game.players?.forEach((player) => {
          if (
            player.name === gamePlayer &&
            player.payment === 'PENDING' &&
            player.lost === true
          ) {
            console.log(game.created.toDate());
            this.nonSubgameSum += this.round(
              this.calculateTotalAmount(
                game.board,
                game.startTime,
                game.endTime!
              ) / this.countLostPlayers(game.players!)
            );
            console.log(this.nonSubgameSum);
          }
        });
      });
    } else if (gamePlayer && startDate && endDate) {
      this.games.forEach((game) => {
        const playedCreatedDate = new Date(game.created.toDate());
        game.players?.forEach((player) => {
          if (
            player.name === gamePlayer &&
            player.payment === 'PENDING' &&
            player.lost === true &&
            playedCreatedDate >= startDate &&
            playedCreatedDate <= endDate
          ) {
            console.log(game.created.toDate());
            this.nonSubgameSum += this.round(
              this.calculateTotalAmount(
                game.board,
                game.startTime,
                game.endTime!
              ) / this.countLostPlayers(game.players!)
            );
            console.log(this.nonSubgameSum);
          }
        });
      });
    }
  }

  gameAmountSub() {
    this.subgameSum = 0;

    const subscriber = this.gameForm.value.player;
    const startDate = this.gameForm.value.startDate
      ? new Date(this.gameForm.value.startDate)
      : null;
    const endDate = this.gameForm.value.endDate
      ? new Date(this.gameForm.value.endDate)
      : null;

    if (subscriber && (!startDate || !endDate)) {
      this.games.forEach((game) => {
        game.players?.forEach((player) => {
          if (
            player.name === subscriber &&
            player.payment === 'PENDING' &&
            player.lost === true
          ) {
            console.log(game);

            let sum = Number(
              this.calculateMinutes(game.startTime, game.endTime!) /
                this.countLostPlayers(game.players!)
            );
            console.log(sum);

            this.subgameSum += sum;
          }
        });
      });
    } else if (subscriber && startDate && endDate) {
      this.games.forEach((game) => {
        const playedCreatedDate = new Date(game.created.toDate());
        game.players?.forEach((player) => {
          if (
            player.name === subscriber &&
            player.payment === 'PENDING' &&
            player.lost === true &&
            playedCreatedDate >= startDate &&
            playedCreatedDate <= endDate
          ) {
            this.subgameSum += Number(
              this.calculateMinutes(game.startTime, game.endTime!) /
                this.countLostPlayers(game.players!)
            );
          }
        });
      });
    }
  }

  orderAmount() {
    this.orderSum = 0;
    const player = this.orderForm.value.player;
    const startDate = this.orderForm.value.startDate
      ? new Date(this.orderForm.value.startDate)
      : null;
    const endDate = this.orderForm.value.endDate
      ? new Date(this.orderForm.value.endDate)
      : null;

    this.orders.forEach((order) => {
      if (order.payment === 'PENDING') {
        if (player && (!startDate || !endDate)) {
          if (
            order.customer.toLowerCase() ===
            this.orderForm.value.player?.toLowerCase()
          ) {
            this.orderSum += Number(order.totalAmount);
          }
        } else if (player && startDate && endDate) {
          if (
            order.customer.toLowerCase() ===
            this.orderForm.value.player?.toLowerCase()
          ) {
            const orderCreatedDate = new Date(order.created.toDate());
            if (orderCreatedDate >= startDate && orderCreatedDate <= endDate) {
              this.orderSum += Number(order.totalAmount);
            }
          }
        }
      }
    });
  }

  viewTable() {
    if (this.filterForm.valid) {
      let filterData = this.filterForm.value;
      let startDate = filterData.startDate
        ? new Date(filterData.startDate)
        : null;
      let endDate = filterData.endDate ? new Date(filterData.endDate) : null;

      if (filterData.billType === 'games') {
        this.filteredData = this.games.filter((game) => {
          game.players?.filter((player) => {
            player.name.toLowerCase() === filterData.member?.toLowerCase() &&
              player.lost === true &&
              player.payment === 'PENDING' &&
              new Date(game.created.toDate()) >= startDate! &&
              new Date(game.created.toDate()) <= endDate!;
          });
        });
        console.log(this.filteredData);
      } else if (filterData.billType === 'orders') {
        this.filteredData = this.orders.filter((order) => {
          order.customer.toLowerCase() === filterData.member?.toLowerCase() &&
            new Date(order.created.toDate()) >= startDate! &&
            new Date(order.created.toDate()) <= endDate!;
        });
        console.log(this.filteredData);
      }
    }
  }
}
