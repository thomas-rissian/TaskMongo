import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  // redirect root to task list
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'home', redirectTo: 'tasks', pathMatch: 'full' },

  // more specific routes first
  
  { path: 'tasks/create', loadComponent: () => import('./components/tasks/task-form/task-form').then(m => m.TaskForm) },
  { path: 'tasks/:id/edit', loadComponent: () => import('./components/tasks/task-form/task-form').then(m => m.TaskForm) },
  { path: 'tasks/:id', loadComponent: () => import('./pages/task/task-detail/task-detail').then(m => m.TaskDetail) },

  // list
  { path: 'tasks', loadComponent: () => import('./pages/task/board-view/board-view').then(m => m.BoardViewComponent), pathMatch: 'full' },
  { path: '**', redirectTo: 'tasks', pathMatch: 'full' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: false }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}