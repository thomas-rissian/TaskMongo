import { RedirectCommand, RouterModule, Routes } from '@angular/router';
import { TaskList } from './pages/task/task-list/task-list';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  {path: '', redirectTo: '', pathMatch: 'full' },
  {path: 'home', redirectTo: '', pathMatch: 'full' },
  {path: 'tasks', loadComponent: () => import('./pages/task/task-list/task-list').then(m => m.TaskList), pathMatch: 'full' },
  {path: 'tasks/:id', loadComponent: () => import('./pages/task/task-detail/task-detail').then(m => m.TaskDetail), pathMatch: 'full' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: false }) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}