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

    // Filtrer les tâches localement
    let filtered = this.tasks.filter((task: Task) => {
      // Filtre recherche (q) - LIKE %word% dans plusieurs champs
      if (filters.q) {
        const query = filters.q.toLowerCase();
        const matchTitle = task.titre?.toLowerCase().includes(query);
        const matchDesc = task.description?.toLowerCase().includes(query);
        const matchAuthorNom = task.auteur?.nom?.toLowerCase().includes(query);
        const matchAuthorPrenom = task.auteur?.prenom?.toLowerCase().includes(query);
        const matchCategorie = task.categorie?.toLowerCase().includes(query);
        const matchEtiquettes = task.etiquettes?.some(e => e.toLowerCase().includes(query));
        
        if (!matchTitle && !matchDesc && !matchAuthorNom && !matchAuthorPrenom && !matchCategorie && !matchEtiquettes) {
          return false;
        }
      }

      // Filtre statut
      if (filters.statut && task.statut !== filters.statut) {
        return false;
      }

      // Filtre priorité
      if (filters.priorite && task.priorite !== filters.priorite) {
        return false;
      }

      // Filtre catégorie
      if (filters.categorie && task.categorie !== filters.categorie) {
        return false;
      }

      // Filtre étiquette - LIKE %word% (cherche les lettres dedans)
      if (filters.etiquette) {
        const etiquetteQuery = filters.etiquette.toLowerCase();
        const matchEtiquette = task.etiquettes?.some(e => e.toLowerCase().includes(etiquetteQuery));
        if (!matchEtiquette) {
          return false;
        }
      }

      // Filtre date avant
      if (filters.avant) {
        const dateAvant = new Date(filters.avant);
        const taskDate = task.echeance ? new Date(task.echeance) : new Date('9999-12-31');
        if (taskDate > dateAvant) return false;
      }

      // Filtre date après
      if (filters.apres) {
        const dateApres = new Date(filters.apres);
        const taskDate = task.echeance ? new Date(task.echeance) : new Date('1900-01-01');
        if (taskDate < dateApres) return false;
      }

      return true;
    });

    // Appliquer le tri
    if (filters.tri) {
      const tri = filters.tri;
      const ordre = filters.ordre === 'asc' ? 1 : -1;

      filtered.sort((a: Task, b: Task) => {
        let valA: any;
        let valB: any;

        switch (tri) {
          case 'dateCreation':
            valA = a.dateCreation ? new Date(a.dateCreation).getTime() : 0;
            valB = b.dateCreation ? new Date(b.dateCreation).getTime() : 0;
            break;
          case 'echeance':
            valA = a.echeance ? new Date(a.echeance).getTime() : 0;
            valB = b.echeance ? new Date(b.echeance).getTime() : 0;
            break;
          case 'priorite':
            const prioriteOrder: { [key: string]: number } = {
              'Critical': 4,
              'High': 3,
              'Medium': 2,
              'Low': 1
            };
            valA = prioriteOrder[a.priorite || ''] || 0;
            valB = prioriteOrder[b.priorite || ''] || 0;
            break;
          case 'titre':
            valA = (a.titre || '').toLowerCase();
            valB = (b.titre || '').toLowerCase();
            break;
          default:
            valA = a.dateCreation ? new Date(a.dateCreation).getTime() : 0;
            valB = b.dateCreation ? new Date(b.dateCreation).getTime() : 0;
        }

        if (valA < valB) return -1 * ordre;
        if (valA > valB) return 1 * ordre;
        return 0;
      });
    }

    this.filteredTasks = filtered;
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
