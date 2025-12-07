import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksService } from '@task-app/core/service/tasks.service';
import { Task } from '@task-app/models/task.model';
import { STATUS } from '@task-app/models/status.model';
import { StatusColumnComponent } from '../../../components/tasks/board/status-column/status-column.component';
import { Loader } from '@libs/ui/component.lib.include';
import { MatDialogModule } from '@angular/material/dialog';
import { TaskForm } from '../../../components/tasks/form/task-form';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-board-view',
  standalone: true,
  imports: [CommonModule, StatusColumnComponent, Loader, MatDialogModule],
  templateUrl: './board-view.html'
})
export class BoardViewComponent implements OnInit {
  tasks: Task[] = [];
  statuses = STATUS;
  loading = true;
  @ViewChild(Loader) loader!: Loader;

  constructor(private dialog: MatDialog, private tasksService: TasksService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
      this.loadTasks();
  }

  loadTasks(): void {
    this.tasksService.getTasks().subscribe((data: Task[]) => {
      this.tasks = data;
      this.loading = false;
      this.loader.hide();
      this.cdr.detectChanges();
    });
  }
  getTasksByStatus(status: string): Task[] {
    if (!this.tasks?.length) return [];
    return this.tasks.filter((t: Task) => t.statut === status);
  }
  openEditModal(task?: Task) {
    const dialogRef = this.dialog.open(TaskForm, {
      width: '720px',
      data: { task },
      panelClass: 'tailwind-modal'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadTasks();
      }
    });
  }
}
