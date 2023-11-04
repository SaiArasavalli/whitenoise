import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CustomerAddComponent } from './components/customer-add/customer-add.component';
import { GameAddComponent } from './components/game-add/game-add.component';
import { GameEditComponent } from './components/game-edit/game-edit.component';
import { GameDeleteComponent } from './components/game-delete/game-delete.component';
import { OrderAddComponent } from './components/order-add/order-add.component';
import { OrderEditComponent } from './components/order-edit/order-edit.component';
import { OrderDeleteComponent } from './components/order-delete/order-delete.component';
import { GameListComponent } from './components/game-list/game-list.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerEditComponent } from './components/customer-edit/customer-edit.component';
import { CustomerDeleteComponent } from './components/customer-delete/customer-delete.component';
import { BoardListComponent } from './components/board-list/board-list.component';
import { BoardAddComponent } from './components/board-add/board-add.component';
import { BoardEditComponent } from './components/board-edit/board-edit.component';
import { BoardDeleteComponent } from './components/board-delete/board-delete.component';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { MenuAddComponent } from './components/menu-add/menu-add.component';
import { MenuEditComponent } from './components/menu-edit/menu-edit.component';
import { MenuDeleteComponent } from './components/menu-delete/menu-delete.component';
import { CalciComponent } from './components/calci/calci.component';
import { OrderAddShareComponent } from './components/order-add-share/order-add-share.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'boards', component: BoardListComponent },
  { path: 'boards/add', component: BoardAddComponent },
  { path: 'boards/:boardId/edit', component: BoardEditComponent },
  { path: 'boards/:boardId/delete', component: BoardDeleteComponent },
  { path: 'customers', component: CustomerListComponent },
  { path: 'customers/add', component: CustomerAddComponent },
  { path: 'customers/:customerId/edit', component: CustomerEditComponent },
  { path: 'customers/:customerId/delete', component: CustomerDeleteComponent },
  { path: 'games', component: GameListComponent },
  { path: 'games/add', component: GameAddComponent },
  { path: 'games/:gameId/edit', component: GameEditComponent },
  { path: 'games/:gameId/delete', component: GameDeleteComponent },
  { path: 'menu', component: MenuListComponent },
  { path: 'menu/add', component: MenuAddComponent },
  { path: 'menu/:itemId/edit', component: MenuEditComponent },
  { path: 'menu/:itemId/delete', component: MenuDeleteComponent },
  { path: 'orders', component: OrderListComponent },
  { path: 'orders/add', component: OrderAddComponent },
  { path: 'orders/add/share', component: OrderAddShareComponent },
  { path: 'orders/:orderId/edit', component: OrderEditComponent },
  { path: 'orders/:orderId/delete', component: OrderDeleteComponent },
  { path: 'bill', component: CalciComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
