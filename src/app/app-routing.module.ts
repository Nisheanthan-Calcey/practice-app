import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { ToDoHomePage } from './to-do/screens/to-do-home.page';

const routes: Routes = [
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  },
  {
    path: '',
    component: ToDoHomePage,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
