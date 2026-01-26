import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '@task-app/models/task.model';

@Component({
  selector: 'app-task-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-history.html',
  styleUrls: ['./task-history.scss']
})
export class TaskHistoryComponent {
  @Input() task: Task | null = null;
  @Output() close = new EventEmitter<void>();

  getChangeIcon(champModifie: string): string {
    const icons: { [key: string]: string } = {
      'titre': '📝',
      'description': '📄',
      'statut': '📋',
      'priorite': '🔴',
      'categorie': '🏷️',
      'etiquettes': '🏷️',
      'echeance': '📅',
      'auteur': '👤',
      'sousTaches': '✓',
      'commentaires': '💬'
    };
    return icons[champModifie] || '📝';
  }

  getFieldLabel(champModifie: string): string {
    const labels: { [key: string]: string } = {
      'titre': 'Titre',
      'description': 'Description',
      'statut': 'Statut',
      'priorite': 'Priorité',
      'categorie': 'Catégorie',
      'etiquettes': 'Étiquettes',
      'echeance': 'Échéance',
      'auteur': 'Auteur',
      'sousTaches': 'Sous-tâches',
      'commentaires': 'Commentaires'
    };
    return labels[champModifie] || champModifie;
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  formatValue(value: any): string {
    if (value === null || value === undefined) {
      return '(vide)';
    }

    // Si c'est un string, retourner directement
    if (typeof value === 'string') {
      return value;
    }

    // Si c'est un boolean
    if (typeof value === 'boolean') {
      return value ? 'Oui' : 'Non';
    }

    // Si c'est un number
    if (typeof value === 'number') {
      return value.toString();
    }

    // Si c'est un array
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return '(vide)';
      }

      // Vérifier si c'est un array de sous-tâches
      if (value[0]?.titre && value[0]?.statut) {
        return value.map((st: any) => {
          const echeance = st.echeance ? ` (Échéance: ${new Date(st.echeance).toLocaleDateString('fr-FR')})` : '';
          return `• "${st.titre}" - ${st.statut}${echeance}`;
        }).join('\n');
      }

      // Vérifier si c'est un array de commentaires
      if (value[0]?.auteur && value[0]?.contenu) {
        return value.map((c: any) => {
          const auteur = c.auteur?.prenom && c.auteur?.nom ? `${c.auteur.prenom} ${c.auteur.nom}` : 'Anonyme';
          const date = c.date ? ` (${new Date(c.date).toLocaleDateString('fr-FR')})` : '';
          return `• ${auteur}${date}: ${c.contenu}`;
        }).join('\n');
      }

      // Si c'est un array de strings (étiquettes)
      if (typeof value[0] === 'string') {
        return value.join(', ');
      }

      // Fallback: afficher le nombre et type
      return `${value.length} élément(s)`;
    }

    // Si c'est un objet (auteur)
    if (typeof value === 'object') {
      const obj = value as any;

      // Pour les auteurs
      if (obj.nom || obj.prenom || obj.email) {
        const nom = obj.nom || '';
        const prenom = obj.prenom || '';
        const email = obj.email ? ` (${obj.email})` : '';
        return `${prenom} ${nom}${email}`.trim();
      }

      // Fallback
      return '[Objet complexe]';
    }

    return String(value);
  }

  onClose(): void {
    this.close.emit();
  }
}
