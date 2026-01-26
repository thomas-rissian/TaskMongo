import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterParams {
  statut?: string;
  priorite?: string;
  categorie?: string;
  etiquette?: string;
  avant?: string;
  apres?: string;
  q?: string;
  tri?: string;
  ordre?: 'asc' | 'desc';
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

  // Filtres de recherche et basiques
  searchQuery = '';
  selectedStatut = '';
  selectedPriorite = '';
  selectedCategorie = '';
  
  // Filtres avancés
  selectedEtiquette = '';
  dateAvant = '';
  dateApres = '';
  
  // Tri
  selectedTri = 'dateCreation';
  selectedOrdre: 'asc' | 'desc' = 'desc';

  // Options disponibles
  statuts = ['Backlog', 'Ready', 'In progress', 'In review', 'Done'];
  priorites = ['Low', 'Medium', 'High', 'Critical'];
  categories = ['Backend', 'Frontend', 'Database', 'DevOps', 'Testing'];
  etiquettes = ['bug', 'feature', 'enhancement', 'documentation', 'refactor', 'urgent'];
  triOptions = [
    { value: 'dateCreation', label: 'Date de création' },
    { value: 'echeance', label: 'Échéance' },
    { value: 'priorite', label: 'Priorité' },
    { value: 'titre', label: 'Titre' }
  ];

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
    if (this.selectedEtiquette) {
      filters.etiquette = this.selectedEtiquette;
    }
    if (this.dateAvant) {
      filters.avant = this.dateAvant;
    }
    if (this.dateApres) {
      filters.apres = this.dateApres;
    }
    
    // Toujours ajouter le tri et l'ordre
    filters.tri = this.selectedTri;
    filters.ordre = this.selectedOrdre;

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
    this.selectedEtiquette = '';
    this.dateAvant = '';
    this.dateApres = '';
    this.selectedTri = 'dateCreation';
    this.selectedOrdre = 'desc';
    this.filterChange.emit({
      tri: 'dateCreation',
      ordre: 'desc'
    });
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
      this.selectedCategorie ||
      this.selectedEtiquette ||
      this.dateAvant ||
      this.dateApres
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
    if (this.selectedEtiquette) count++;
    if (this.dateAvant) count++;
    if (this.dateApres) count++;
    return count;
  }
}
