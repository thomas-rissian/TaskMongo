import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterParams {
  statut?: string;
  priorite?: string;
  categorie?: string;
  q?: string;
}

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-filter.html',
  styleUrls: ['./task-filter.scss']
})
export class TaskFilterComponent {
  @Output() filterChange = new EventEmitter<FilterParams>();
  @Input() isActive = false;

  // Filtres
  searchQuery = '';
  selectedStatut = '';
  selectedPriorite = '';
  selectedCategorie = '';

  // Options disponibles
  statuts = ['Backlog', 'Ready', 'In progress', 'In review', 'Done'];
  priorites = ['Low', 'Medium', 'High', 'Critical'];
  categories = ['Backend', 'Frontend', 'Database', 'DevOps', 'Testing'];

  showAdvanced = false;

  /**
   * Applique les filtres
   */
  applyFilters(): void {
    const filters: FilterParams = {};

    if (this.searchQuery.trim()) {
      filters.q = this.searchQuery.trim();
    }
    if (this.selectedStatut) {
      filters.statut = this.selectedStatut;
    }
    if (this.selectedPriorite) {
      filters.priorite = this.selectedPriorite;
    }
    if (this.selectedCategorie) {
      filters.categorie = this.selectedCategorie;
    }

    this.filterChange.emit(filters);
  }

  /**
   * Réinitialise tous les filtres
   */
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedStatut = '';
    this.selectedPriorite = '';
    this.selectedCategorie = '';
    this.filterChange.emit({});
  }

  /**
   * Toggle pour afficher/masquer filtres avancés
   */
  toggleAdvanced(): void {
    this.showAdvanced = !this.showAdvanced;
    // Appliquer les filtres quand on ouvre le panneau avancé
    if (this.showAdvanced) {
      this.applyFilters();
    }
  }

  /**
   * Vérifie s'il y a des filtres actifs
   */
  hasActiveFilters(): boolean {
    return !!(
      this.searchQuery.trim() ||
      this.selectedStatut ||
      this.selectedPriorite ||
      this.selectedCategorie
    );
  }

  /**
   * Compte le nombre de filtres actifs
   */
  getFilterCount(): number {
    let count = 0;
    if (this.searchQuery.trim()) count++;
    if (this.selectedStatut) count++;
    if (this.selectedPriorite) count++;
    if (this.selectedCategorie) count++;
    return count;
  }
}
