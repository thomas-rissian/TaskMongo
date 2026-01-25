import { ChangeDetectorRef, Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { TasksService } from '../../../core/service/tasks.service';
import { SubtaskService } from '../../../core/service/subtask.service';
import { Task } from '../../../models/task.model';
import { STATUS } from '../../../models/status.model';
import { Loader } from '@libs/ui/component.lib.include';
import { TaskForm } from '../../../components/tasks/task-form/task-form';

@Component({
  selector: 'app-board-view',
  standalone: true,
  imports: [CommonModule, DragDropModule, Loader, TaskForm],
  templateUrl: './board-view.html',
  styleUrls: ['./board-view.scss']
})
export class BoardViewComponent implements OnInit, AfterViewInit {
  tasks: Task[] = [];
  statuses = STATUS;
  loading = true;
  showModal = false;
  selectedTask: Task | null = null;

  @ViewChildren(CdkDropList) dropLists!: QueryList<CdkDropList>;

  constructor(
    private tasksService: TasksService,
    private subtaskService: SubtaskService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
      this.loadTasks();
  }

  ngAfterViewInit(): void {
    // Connecter toutes les drop lists entre elles
    if (this.dropLists.length > 0) {
      this.dropLists.forEach(dropList => {
        dropList.connectedTo = this.dropLists.filter(list => list !== dropList).map(list => list);
      });
      this.cdr.detectChanges();
    }
  }

  getConnectedDropListIds(): string[] {
    return this.statuses.map(status => 'drop-' + status);
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

  removeTask(task: Task) {
    this.tasksService.deleteTask(task._id!).subscribe(() => {
      this.loadTasks();
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedTask = null;
    this.loadTasks();
  }

  // Drag and Drop
  drop(event: CdkDragDrop<Task[]>, newStatus: string) {
    const movedTask = event.previousContainer.data[event.previousIndex];
    if (!movedTask._id) return;

    // Cas 1: Même colonne - rien à faire
    if (event.previousContainer === event.container) {
      return;
    }

    // Cas 2: Changer de colonne - mettre à jour le statut et sauvegarder
    movedTask.statut = newStatus as any;
    this.tasksService.putTask(movedTask).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (err: any) => {
        console.error('Erreur mise à jour statut:', err);
        this.loadTasks();
      }
    });
  }

  // Cocher/décocher une sous-tâche
  toggleSubtask(task: Task, subtaskId: string, currentStatus: string) {
    if (!task._id || !task.sousTaches) return;

    const newStatus = currentStatus === 'Done' ? 'Backlog' : 'Done';
    
    // Trouver et mettre à jour la sous-tâche dans la tâche
    const subtask = task.sousTaches.find(s => s._id === subtaskId);
    if (subtask) {
      subtask.statut = newStatus as any;
      
      // Faire un PUT de la tâche entière avec la sous-tâche modifiée
      this.tasksService.putTask(task).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (err: any) => {
          console.error('Erreur mise à jour sous-tâche:', err);
          this.loadTasks();
        }
      });
    }
  }

  isSubtaskDone(subtask: any): boolean {
    return subtask.statut === 'Done';
  }

  getCompletedSubtaskCount(task: Task): number {
    if (!task.sousTaches || task.sousTaches.length === 0) {
      return 0;
    }
    return task.sousTaches.filter(s => s.statut === 'Done').length;
  }
}
