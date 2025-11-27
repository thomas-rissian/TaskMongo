import { RouterModule, Routes } from '@angular/router';
import { TaskList } from './pages/task/task-list/task-list';
import { NgModule } from '@angular/core';

export const routes: Routes = [

    {path: 'tasks',component: TaskList},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}