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
   * Applique les filtres via l'API /search
   */
  applyFilters(filters: FilterParams): void {
    this.currentFilters = filters;
    this.loading = true;

    // Construire les paramètres pour l'API
    const searchParams: any = {};
    if (filters.q) searchParams.q = filters.q;
    if (filters.statut) searchParams.statut = filters.statut;
    if (filters.priorite) searchParams.priorite = filters.priorite;
    if (filters.categorie) searchParams.categorie = filters.categorie;
    if (filters.etiquette) searchParams.etiquette = filters.etiquette;
    if (filters.avant) searchParams.avant = filters.avant;
    if (filters.apres) searchParams.apres = filters.apres;
    if (filters.tri) searchParams.tri = filters.tri;
    if (filters.ordre) searchParams.ordre = filters.ordre;

    // Appeler l'API search
    this.tasksService.searchTasks(searchParams).subscribe({
      next: (data: Task[]) => {
        this.tasks = data;
        this.filteredTasks = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur recherche:', err);
        this.loading = false;
        this.filteredTasks = [];
        this.cdr.detectChanges();
      }
    });
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
    
    // Préparer le payload avec dates au format ISO et _id seulement si présents
    const cleanSousTaches = (movedTask.sousTaches || []).map((s: any) => {
      const clean: any = {
        titre: s.titre,
        statut: s.statut,
        echeance: s.echeance ? new Date(s.echeance).toISOString() : null,
      };
      if (s._id) clean._id = s._id;
      return clean;
    });

    const cleanCommentaires = (movedTask.commentaires || []).map((c: any) => {
      const clean: any = {
        auteur: c.auteur,
        contenu: c.contenu,
        date: c.date ? new Date(c.date).toISOString() : new Date().toISOString(),
      };
      if (c._id) clean._id = c._id;
      return clean;
    });

    const updatePayload = {
      titre: movedTask.titre,
      description: movedTask.description,
      priorite: movedTask.priorite,
      statut: movedTask.statut,
      categorie: movedTask.categorie,
      etiquettes: movedTask.etiquettes,
      echeance: movedTask.echeance ? new Date(movedTask.echeance).toISOString() : null,
      auteur: movedTask.auteur,
      sousTaches: cleanSousTaches,
      commentaires: cleanCommentaires,
    };
    
    this.tasksService.putTaskWithId(movedTask._id, updatePayload).subscribe({
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
      
      // Nettoyer et formater les sous-tâches
      const cleanSousTaches = (task.sousTaches || []).map((s: any) => {
        const clean: any = {
          titre: s.titre,
          statut: s.statut,
          echeance: s.echeance ? new Date(s.echeance).toISOString() : null,
        };
        if (s._id) clean._id = s._id;
        return clean;
      });

      const cleanCommentaires = (task.commentaires || []).map((c: any) => {
        const clean: any = {
          auteur: c.auteur,
          contenu: c.contenu,
          date: c.date ? new Date(c.date).toISOString() : new Date().toISOString(),
        };
        if (c._id) clean._id = c._id;
        return clean;
      });

      const updatePayload = {
        titre: task.titre,
        description: task.description,
        priorite: task.priorite,
        statut: task.statut,
        categorie: task.categorie,
        etiquettes: task.etiquettes,
        echeance: task.echeance ? new Date(task.echeance).toISOString() : null,
        auteur: task.auteur,
        sousTaches: cleanSousTaches,
        commentaires: cleanCommentaires,
      };
      
      // Faire un PUT de la tâche entière avec la sous-tâche modifiée
      this.tasksService.putTaskWithId(task._id, updatePayload).subscribe({
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
