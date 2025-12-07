import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Task } from '@task-app/models/task.model';
import { SubtaskListComponent } from '../subtask-list/subtask-list.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, RouterLink, SubtaskListComponent],
  templateUrl: './task-card.html'
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  showSubtasks = false;

  toggleSubtasks(): void {
    this.showSubtasks = !this.showSubtasks;
  }

  onEditClick(ev: MouseEvent) {
    ev.stopPropagation();
    this.edit.emit(this.task);
  }

  truncateText(text: string | undefined, lines: number): string {
    if (!text) return '';
    const lineArray = text.split('\n').slice(0, lines);
    return lineArray.join('\n') + (text.split('\n').length > lines ? '...' : '');
  }

  getVisibleLabels(): string[] {
    return (this.task.etiquettes || []).slice(0, 3);
  }

  getRemainingLabelsCount(): number {
    const count = (this.task.etiquettes || []).length - 3;
    return count > 0 ? count : 0;
  }

  getPriorityColor(): string {
    const colorMap: { [key: string]: string } = {
      'Critical': 'bg-red-100 text-red-800',
      'High': 'bg-orange-100 text-orange-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-blue-100 text-blue-800',
    };
    return colorMap[this.task.priorite || ''] || 'bg-gray-100 text-gray-800';
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      month: 'short',
      day: 'numeric',
    });
  }

  getSubtaskProgress(): { completed: number; total: number } {
    const total = this.task.sousTaches?.length || 0;
    const completed =
      this.task.sousTaches?.filter((st) => st.statut === 'Done')?.length || 0;
    return { completed, total };
  }
}
