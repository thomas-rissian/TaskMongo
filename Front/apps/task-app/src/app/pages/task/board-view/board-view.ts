import { ChangeDetectorRef, Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { TasksService } from '../../../core/service/tasks.service';
import { SubtaskService } from '../../../core/service/subtask.service';
import { Task } from '../../../models/task.model';
import { STATUS } from '../../../models/status.model';
import { Loader } from '@libs/ui/component.lib.include';
import { TaskForm } from '../../../components/tasks/task-form/task-form';
import { TaskFilterComponent, FilterParams } from '../../../components/tasks/task-filter/task-filter';

@Component({
  selector: 'app-board-view',
  standalone: true,
  imports: [CommonModule, DragDropModule, Loader, TaskForm, TaskFilterComponent],
  templateUrl: './board-view.html',
  styleUrls: ['./board-view.scss']
})
export class BoardViewComponent implements OnInit, AfterViewInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  statuses = STATUS;
  loading = true;
  showModal = false;
  selectedTask: Task | null = null;
  currentFilters: FilterParams = {};

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
    // Charger TOUTES les tâches UNE SEULE FOIS au démarrage
    this.tasksService.getTasks().subscribe((data: Task[]) => {
      this.tasks = data;
      this.filteredTasks = data;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  /**
   * Applique les filtres LOCALEMENT sans API call
   */
  applyFilters(filters: FilterParams): void {
    this.currentFilters = filters;

    // Si aucun filtre, afficher toutes les tâches
    if (Object.keys(filters).length === 0) {
      this.filteredTasks = [...this.tasks];
      this.cdr.detectChanges();
      return;
    }

    // Filtrer les tâches localement
    this.filteredTasks = this.tasks.filter((task: Task) => {
      // Filtre recherche (q) - cherche dans le titre et la description
      if (filters.q) {
        const query = filters.q.toLowerCase();
        const matchTitle = task.titre?.toLowerCase().includes(query);
        const matchDesc = task.description?.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc) return false;
      }

      // Filtre statut
      if (filters.statut && task.statut !== filters.statut) {
        return false;
      }

      // Filtre priorité
      if (filters.priorite && task.priorite !== filters.priorite) {
        return false;
      }

      // Filtre catégorie (exemple : vérifier si dans les tags ou catégories)
      if (filters.categorie) {
        // À adapter selon votre structure de données
        if (task.categorie !== filters.categorie) {
          return false;
        }
      }

      return true;
    });

    this.cdr.detectChanges();
  }

  getTasksByStatus(status: string): Task[] {
    if (!this.filteredTasks?.length) return [];
    return this.filteredTasks.filter((t: Task) => t.statut === status);
  }

  /**
   * Trouve une tâche dans le tableau source par ID et la met à jour
   */
  private updateTaskInSource(updatedTask: Task): void {
    const index = this.tasks.findIndex(t => t._id === updatedTask._id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
    }
  }

  openEditModal(task?: Task) {
    this.selectedTask = task || null;
    this.showModal = true;
  }

  removeTask(task: Task) {
    this.tasksService.deleteTask(task._id!).subscribe(() => {
      this.applyFilters(this.currentFilters);
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedTask = null;
    // Recharger les données et réappliquer les filtres
    this.tasksService.getTasks().subscribe((data: Task[]) => {
      this.tasks = data;
      this.applyFilters(this.currentFilters);
      this.cdr.detectChanges();
    });
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
      next: (updatedTask: Task) => {
        this.updateTaskInSource(updatedTask);
        this.applyFilters(this.currentFilters);
      },
      error: (err: any) => {
        console.error('Erreur mise à jour statut:', err);
        this.applyFilters(this.currentFilters);
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
        next: (updatedTask: Task) => {
          this.updateTaskInSource(updatedTask);
          this.applyFilters(this.currentFilters);
        },
        error: (err) => {
          console.error('Erreur mise à jour sous-tâche:', err);
          this.applyFilters(this.currentFilters);
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
