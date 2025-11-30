import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../models/task.model';
import { TasksService } from '../../../core/service/tasks.service';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { Loader } from '@libs/ui/loader/loader';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, RouterLink, MatListModule, Loader],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css'],
})
export class TaskList implements OnInit {
  @ViewChild(Loader) loader!: Loader;
  tasks: Task[] = [];
  constructor(private tasksService: TasksService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
      this.tasksService.getTasks().subscribe((data: Task[]) => {
      this.tasks = data;
      this.loader.hide();
      this.cdr.detectChanges();
    });
  }
}
