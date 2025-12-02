import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { TasksService } from '@task-app/core/service/tasks.service';
import { Loader } from '@libs/ui/component.lib.include';
import { Task } from '@task-app/models/task.model';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, RouterLink, MatListModule, Loader],
  templateUrl: './task-list.html',
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
