import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '@task-app/models/task.model';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-status-column',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  templateUrl: './status-column.html'
})
export class StatusColumnComponent {
  @Input() tasks: Task[] = [];
  @Input() status!: string;
  @Output() editTask = new EventEmitter<Task>();
  @Output() removeTask = new EventEmitter<Task>();
  
  getColumnColor(): string {
    const colorMap: { [key: string]: string } = {
      'Backlog': 'bg-gray-100',
      'Ready': 'bg-blue-50',
      'In progress': 'bg-yellow-50',
      'In review': 'bg-orange-50',
      'Done': 'bg-green-50',
    };
    return colorMap[this.status] || 'bg-gray-100';
  }
}
