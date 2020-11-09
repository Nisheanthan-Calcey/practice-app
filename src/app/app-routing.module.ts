import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ToDoHomePage } from './to-do/screens/to-do-home.page';
import { AddToDoPage } from './to-do/pages/add-to-do/add-to-do.page';
import { EditToDoPage } from './to-do/pages/edit-to-do/edit-to-do.page';

const routes: Routes = [
  {
    path: '',
    component: ToDoHomePage,
  },
  {
    path: 'add',
    component: AddToDoPage,
  },
  {
    path: 'edit',
    component: EditToDoPage,
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
