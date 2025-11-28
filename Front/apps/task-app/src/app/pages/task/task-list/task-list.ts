import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task.model';
import { TasksService } from '../../../core/service/tasks.service';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatListModule],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css'],
})
export class TaskList implements OnInit {
  tasks: Task[] = [];
  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    //this.loadTasks();
  }

  loadTasks() {
    this.tasksService.getTasks().subscribe((data: Task[]) => {
      this.tasks = data;
    });
  }
}
