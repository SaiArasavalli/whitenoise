import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { TimerListComponent } from './components/timer-list/timer-list.component';
import { TimerComponent } from './components/timer/timer.component';
import { DatePipe } from '@angular/common';
import { HomeGameListComponent } from './components/home-game-list/home-game-list.component';
import { CustomerAddComponent } from './components/customer-add/customer-add.component';
import { GameAddComponent } from './components/game-add/game-add.component';
import { GameEditComponent } from './components/game-edit/game-edit.component';
import { GameDeleteComponent } from './components/game-delete/game-delete.component';
import { HomeOrderListComponent } from './components/home-order-list/home-order-list.component';
import { OrderAddComponent } from './components/order-add/order-add.component';
import { OrderEditComponent } from './components/order-edit/order-edit.component';
import { OrderDeleteComponent } from './components/order-delete/order-delete.component';
import { GameListComponent } from './components/game-list/game-list.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerEditComponent } from './components/customer-edit/customer-edit.component';
import { CustomerDeleteComponent } from './components/customer-delete/customer-delete.component';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { MenuAddComponent } from './components/menu-add/menu-add.component';
import { MenuEditComponent } from './components/menu-edit/menu-edit.component';
import { MenuDeleteComponent } from './components/menu-delete/menu-delete.component';
import { BoardListComponent } from './components/board-list/board-list.component';
import { BoardAddComponent } from './components/board-add/board-add.component';
import { BoardEditComponent } from './components/board-edit/board-edit.component';
import { BoardDeleteComponent } from './components/board-delete/board-delete.component';
import { CalciComponent } from './components/calci/calci.component';
import { OrderAddShareComponent } from './components/order-add-share/order-add-share.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    TimerListComponent,
    TimerComponent,
    HomeGameListComponent,
    CustomerAddComponent,
    GameAddComponent,
    GameEditComponent,
    GameDeleteComponent,
    HomeOrderListComponent,
    OrderAddComponent,
    OrderEditComponent,
    OrderDeleteComponent,
    GameListComponent,
    OrderListComponent,
    CustomerListComponent,
    CustomerEditComponent,
    CustomerDeleteComponent,
    MenuListComponent,
    MenuAddComponent,
    MenuEditComponent,
    MenuDeleteComponent,
    BoardListComponent,
    BoardAddComponent,
    BoardEditComponent,
    BoardDeleteComponent,
    CalciComponent,
    OrderAddShareComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
