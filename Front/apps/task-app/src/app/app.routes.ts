import { RouterModule, Routes } from '@angular/router';
import { TaskList } from './pages/task/task-list/task-list';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', loadComponent: () => import('./pages/task/task-list/task-list').then(m => m.TaskList) },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: false }) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}