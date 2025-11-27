import { Component, OnInit } from '@angular/core';
import { Task } from '../../../models/task.model';
import { TasksService } from '../../../core/service/tasks.service';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-task-list',
  imports: [RouterLink, MatListModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList implements OnInit {
  tasks: Task[] = [];
  constructor(private tasksService: TasksService) {}
  
  ngOnInit(): void {
    
  }

  loadTasks() {
    const tasksObservable = this.tasksService.getTasks();
    tasksObservable.subscribe((data: Task[]) => {
      this.tasks = data;
    });
  }
}
