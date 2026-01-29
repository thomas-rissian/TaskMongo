import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-editable-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './TaskEditableContainer.html',
})
export class TaskEditableContainer {
  @Input({ required: true }) title: string = '';
  @Input() viewTemplate: TemplateRef<any> | null = null;
  @Input() editTemplate: TemplateRef<any> | null = null;
  @Output() edit = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  isEditing = false;

  enableEditing(): void {
    this.isEditing = true;
    this.edit.emit();
  }

  onSave(): void {
    this.isEditing = false;
    this.save.emit();
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.cancel.emit();
  }

  onDelete(): void {
    this.delete.emit();
  }
}
