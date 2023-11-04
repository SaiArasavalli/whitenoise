import { Component, Input } from '@angular/core';
import { Board } from 'src/app/interfaces/board';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Customer } from 'src/app/interfaces/customer';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent {
  @Input() board!: Board;
  @Input() i!: number;
  customers: Customer[] = [];
  submitting: boolean = false;
  startTime: any;
  startTimeEdit: any;
  endTime: any;
  duration: string = '00:00';
  durationSeconds: string = '00';
  intervalId: any;
  showStartTimeEditForm!: boolean;

  gameForm = this.fb.group({
    players: this.fb.array([], Validators.required),
  });

  startTimeForm = this.fb.group({
    startTime: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {}

  ngOnInit() {
    const q1 = query(collection(db, 'customers'), orderBy('name'));
    const unsubscribe1 = onSnapshot(q1, (querySnapshot) => {
      this.customers = [];
      querySnapshot.forEach((doc) => {
        this.customers.push({ id: doc.id, ...doc.data() } as Customer);
      });
    });
    const q = query(
      collection(db, 'timers'),
      where('boardId', '==', this.board.id)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data()['startTime']) {
          this.startTime = this.parseTimeString(doc.data()['startTime']);
          this.intervalId = setInterval(() => this.timer(), 1000);
        }
        if (doc.data()['endTime']) {
          this.endTime = this.parseTimeString(doc.data()['endTime']);
          clearInterval(this.intervalId);
        }
      });
    });
  }

  parseTimeString(timeString: any): Date {
    // Assuming timeString is in the format "HH:mm" (e.g., "09:30")
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  openStartTimeEditForm() {
    this.showStartTimeEditForm = !this.showStartTimeEditForm;
  }

  timer() {
    if (this.startTime && !this.endTime) {
      const currentTime = new Date();
      const elapsedTimeInSeconds = Math.floor(
        (currentTime.getTime() - this.startTime.getTime()) / 1000
      );

      const hours = this.padNumber(Math.floor(elapsedTimeInSeconds / 3600));
      const minutes = this.padNumber(
        Math.floor((elapsedTimeInSeconds % 3600) / 60)
      );
      const seconds = this.padNumber(Math.floor(elapsedTimeInSeconds % 60));

      this.duration = `${hours}:${minutes}`;
      this.durationSeconds = `${seconds}`;
    }
  }

  async onStartTimeEdit() {
    clearInterval(this.intervalId);
    const inputTime = this.startTimeForm.get('startTime')?.value;

    this.startTime = this.parseTimeString(
      this.startTimeForm.get('startTime')?.value
    );
    const q = query(
      collection(db, 'timers'),
      where('boardId', '==', this.board.id)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnap) => {
      const timerRef = doc(db, 'timers', docSnap.id);
      await updateDoc(timerRef, {
        startTime: this.datePipe.transform(this.startTime, 'HH:mm'),
      });
    });

    this.intervalId = setInterval(() => this.timer(), 1000);
    this.startTimeForm.reset();
    this.openStartTimeEditForm();
  }

  padNumber(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  async start() {
    this.startTime = new Date();
    const q = query(
      collection(db, 'timers'),
      where('boardId', '==', this.board.id)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnap) => {
      const timerRef = doc(db, 'timers', docSnap.id);
      await updateDoc(timerRef, {
        startTime: this.datePipe.transform(this.startTime, 'HH:mm'),
      });
    });
    this.intervalId = setInterval(() => this.timer(), 1000);
  }

  async stop() {
    this.endTime = new Date();
    const q = query(
      collection(db, 'timers'),
      where('boardId', '==', this.board.id)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnap) => {
      const timerRef = doc(db, 'timers', docSnap.id);
      await updateDoc(timerRef, {
        endTime: this.datePipe.transform(this.endTime, 'HH:mm'),
      });
    });
    clearInterval(this.intervalId);
  }

  get players() {
    return this.gameForm.get('players') as FormArray;
  }

  addItems() {
    this.players.push(
      this.fb.group({
        name: ['', Validators.required],
        lost: false,
        payment: [''],
      })
    );
  }

  removeItem(index: number) {
    this.players.removeAt(index);
  }

  async onSubmit() {
    if (
      this.gameForm.valid &&
      this.startTime &&
      this.endTime &&
      this.gameForm.value.players?.length
    ) {
      this.submitting = true;
      this.datePipe.transform(this.startTime, 'HH:mm');
      const gameData = this.gameForm.value;
      await addDoc(collection(db, 'games'), {
        board: this.board.name,
        startTime: this.datePipe.transform(this.startTime, 'HH:mm'),
        endTime: this.datePipe.transform(this.endTime, 'HH:mm'),
        players: gameData.players,
        created: serverTimestamp(),
      });
      this.submitting = false;
      this.showStartTimeEditForm = false;
      this.reset();
    }
  }

  async reset() {
    this.gameForm = this.fb.group({
      players: this.fb.array([]),
    });
    const q = query(
      collection(db, 'timers'),
      where('boardId', '==', this.board.id)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docSnap) => {
      const timerRef = doc(db, 'timers', docSnap.id);
      await updateDoc(timerRef, {
        startTime: '',
        endTime: '',
      });
    });
    this.startTime = '';
    this.endTime = '';
    this.duration = '00:00';
    this.durationSeconds = '00';
    this.showStartTimeEditForm = false;
  }
}
