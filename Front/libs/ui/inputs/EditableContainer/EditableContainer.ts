import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editable-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './editableContainer.html',
})
export class EditableContainer {
  @Input() title: string = '';
  @Input() canSave: boolean = true;

  @ContentChild('viewMode', { static: false }) viewTemplate!: TemplateRef<any>;
  @ContentChild('editMode', { static: false }) editTemplate!: TemplateRef<any>;

  @Output() save = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() modeChange = new EventEmitter<boolean>();

  isEditing: boolean = false;

  enableEditing() {
    this.isEditing = true;
    this.modeChange.emit(true);
  }

  cancelEditing() {
    this.isEditing = false;
    this.cancel.emit();
    this.modeChange.emit(false);
  }

  onSave() {
    if(!this.canSave) return;
    
    this.isEditing = false;
    this.save.emit();
    this.modeChange.emit(false);
  }
  
  onDelete() {
    this.delete.emit();
  }
}