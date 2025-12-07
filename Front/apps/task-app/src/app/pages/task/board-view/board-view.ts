import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from '@task-app/core/service/tasks.service';
import { Task } from '@task-app/models/task.model';
import { STATUS } from '@task-app/models/status.model';
import { StatusColumnComponent } from '../../../components/tasks/board/status-column/status-column.component';
import { Loader } from '@libs/ui/component.lib.include';
import { TaskForm } from '../../../components/tasks/form/task-form';

@Component({
  selector: 'app-board-view',
  standalone: true,
  imports: [CommonModule, StatusColumnComponent, Loader, TaskForm],
  templateUrl: './board-view.html'
})
export class BoardViewComponent implements OnInit {
  tasks: Task[] = [];
  statuses = STATUS;
  loading = true;
  showModal = false;
  selectedTask: Task | null = null;

  constructor(private tasksService: TasksService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
      this.loadTasks();
  }

  loadTasks(): void {
    this.tasksService.getTasks().subscribe((data: Task[]) => {
      this.tasks = data;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }
  getTasksByStatus(status: string): Task[] {
    if (!this.tasks?.length) return [];
    return this.tasks.filter((t: Task) => t.statut === status);
  }
  openEditModal(task?: Task) {
    this.selectedTask = task || null;
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
    this.selectedTask = null;
    this.loadTasks();
  }
}
