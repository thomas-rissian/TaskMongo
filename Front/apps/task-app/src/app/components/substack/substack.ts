import { ChangeDetectionStrategy, Component, Input, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectSimpleField, TextField } from '@libs/ui/component.lib.include';
import { TaskEditableContainer } from '@libs/ui/inputs/TaskEditableContainer/TaskEditableContainer';

@Component({
  selector: 'app-substack',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, SelectSimpleField, TaskEditableContainer, TextField],
  templateUrl: './substack.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Substack {
  @Input({ required: true }) subtaskForm!: FormArray;
  @Input() statusList: string[] = [];

  newTitle = '';
  newEcheance: string | null = null; // yyyy-mm-dd
  newStatus: string = '';
  subtaskEdits: Array<any> = [];

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {}

  getControls(): FormGroup[] {
    return (this.subtaskForm as FormArray).controls as FormGroup[];
  }

  getControlField(ctrl: FormGroup, field: string): FormControl {
    return ctrl.get(field) as FormControl;
  }

  // Convert ISO date or any date format to "YYYY-MM-DD" for input[type=date]
  private toInputDateValue(val?: string | Date | null): string | null {
    if (!val) return null;
    const d = typeof val === 'string' ? new Date(val) : val;
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split('T')[0]; // "2025-12-15"
  }

  // creates a new FormGroup — normalize echeance to input format
  createSubtaskGroup(data?: any): FormGroup {
    return this.fb.group({
      _id: [data?._id ?? null],
      titre: [data?.titre ?? '', Validators.required],
      statut: [data?.statut ?? (this.statusList?.[0] ?? 'Backlog')],
      // IMPORTANT: convert to "YYYY-MM-DD" for input[type=date]
      echeance: [this.toInputDateValue(data?.echeance ?? null)],
    });
  }

  addSubtask(): void {
    const titre = (this.newTitle ?? '').trim();
    if (!titre) return;
    const statut = this.newStatus || (this.statusList?.[0] ?? 'Backlog');

    const group = this.createSubtaskGroup({
      titre,
      statut,
      echeance: this.newEcheance ?? null,
    });

    (this.subtaskForm as FormArray).push(group);
    this.newTitle = '';
    this.newEcheance = null;
    this.newStatus = '';
    this.cd.markForCheck();
  }

  removeSubtask(index: number): void {
    (this.subtaskForm as FormArray).removeAt(index);
    this.subtaskEdits.splice(index, 1);
  }

  prepareEdit(index: number): void {
    const g = this.getControls()[index];
    const snapshot = {
      titre: g.get('titre')?.value,
      statut: g.get('statut')?.value,
      echeance: this.toInputDateValue(g.get('echeance')?.value),
    };
    this.subtaskEdits[index] = snapshot;
    this.cd.markForCheck();
  }

  saveEdit(index: number): void {
    this.subtaskEdits[index] = undefined;
    this.cd.markForCheck();
  }

  cancelEdit(index: number): void {
    const snapshot = this.subtaskEdits[index];
    if (!snapshot) return;
    const g = this.getControls()[index];
    g.patchValue(snapshot);
    this.subtaskEdits[index] = undefined;
    this.cd.markForCheck();
  }

  trackByIndex(_index: number): number {
    return _index;
  }
}