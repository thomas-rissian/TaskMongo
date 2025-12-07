import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subtask } from '@task-app/models/subtask.model';

@Component({
  selector: 'app-subtask-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subtask-list.html'
})
export class SubtaskListComponent {
  @Input() subtasks: Subtask[] = [];
}
