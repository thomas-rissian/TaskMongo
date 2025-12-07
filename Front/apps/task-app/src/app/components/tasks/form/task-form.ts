import { Component, Inject, inject, Input, Output, EventEmitter, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PRIORITY, STATUS, Task } from '@task-app/models/model.include.model';
import { Comment, AuthorSelect } from '@task-app/components/component.include';
import { TasksService } from '@task-app/core/service/tasks.service';
import { arrayValidator } from '@task-app/core/validator/array.validator';
import { SelectSimpleField } from '@libs/ui/component.lib.include';
import { Substack } from "@task-app/components/substack/substack";
import { Etiquettes } from "@task-app/components/etiquettes/etiquettes";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, AuthorSelect, SelectSimpleField, Comment, Substack, Etiquettes],
  templateUrl: './task-form.html',
})
export class TaskForm implements OnInit {
  @Input() task: Task | null | undefined;
  @Output() close = new EventEmitter<void>();

  private activatedRoute = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private taskService = inject(TasksService);
  private router = inject(Router);

  PRIORITY: string[] = PRIORITY;
  STATUS: string[] = STATUS;

  taskForm!: FormGroup;
  taskId: string | undefined;

  ngOnInit(): void {
    this.initForm();
    // If task passed via @Input (modal mode)
    if (this.task && this.task._id) {
      this.taskId = this.task._id;
      const { commentaires, sousTaches, etiquettes, historiqueModifications, ...simple } = this.task as any;
      this.taskForm.patchValue(simple);
      this.taskForm.setControl('commentaires', this.fb.array((commentaires || []).map((c: any) => this.createCommentaireGroup(c))));
      this.taskForm.setControl('sousTaches', this.fb.array((sousTaches || []).map((s: any) => this.createSousTacheGroup(s))));
      this.taskForm.setControl('etiquettes', this.fb.array((etiquettes || []).map((tag: string) => this.fb.control(tag))));
      return;
    }

    // If opened via route
    this.taskId = this.activatedRoute.snapshot.params['id'] || undefined; 
    if (this.taskId) {
      this.loadTask();
    }
  }
constructor(
    @Optional() @Inject(MatDialogRef) private dialogRef?: MatDialogRef<TaskForm>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: { task?: Task }
  ) {}
  get titreControl(): FormControl { return this.taskForm.get('titre') as FormControl; }
  get descriptionControl(): FormControl { return this.taskForm.get('description') as FormControl; }
  get auteurGroup(): FormGroup { return this.taskForm.get('auteur') as FormGroup; }
  get commentaires(): FormArray { return this.taskForm.get('commentaires') as FormArray; }
  get sousTaches(): FormArray { return this.taskForm.get('sousTaches') as FormArray; }
  get etiquettes(): FormArray { return this.taskForm.get('etiquettes') as FormArray; }
  get prioriteControl(): FormControl { return this.taskForm.get('priorite') as FormControl; }
  get statutControl(): FormControl { return this.taskForm.get('statut') as FormControl; }

  private initForm(): void {
    this.taskForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      auteur: this.fb.group({
        nom: ['', [Validators.required, Validators.minLength(3)]],
        prenom: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
      }),
      commentaires: this.fb.array([]),
      sousTaches: this.fb.array([]),
      etiquettes: this.fb.array([]),
      statut: ['', [Validators.required, arrayValidator(STATUS)]],
      priorite: ['', [Validators.required, arrayValidator(PRIORITY)]],
    });
  }

  private toInputDateValue(val?: string | Date | null): string | null {
    if (!val) return null;
    const d = typeof val === 'string' ? new Date(val) : val;
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split('T')[0];
  }

  private createCommentaireGroup(c?: any): FormGroup {
    return this.fb.group({
      _id: [c?._id ?? null],
      auteur: this.fb.group({
        nom: [c?.auteur?.nom ?? ''],
        prenom: [c?.auteur?.prenom ?? ''],
        email: [c?.auteur?.email ?? '', [Validators.email]],
      }),
      date: [c?.date ?? new Date().toISOString()],
      contenu: [c?.contenu ?? '', Validators.required],
    });
  }

  private createSousTacheGroup(s?: any): FormGroup {
    return this.fb.group({
      _id: [s?._id ?? null],
      titre: [s?.titre ?? '', Validators.required],
      statut: [s?.statut ?? 'Backlog'],
      echeance: [this.toInputDateValue(s?.echeance)],
    });
  }

  private loadTask(): void {
    if (!this.taskId) return;

    this.taskService.getTaskById(this.taskId).subscribe((data) => {
      this.task = data;
      const { commentaires, sousTaches, etiquettes, historiqueModifications, ...simple } = data;
      this.taskForm.patchValue(simple);

      this.taskForm.setControl('commentaires', this.fb.array((commentaires || []).map((c: any) => this.createCommentaireGroup(c))));
      this.taskForm.setControl('sousTaches', this.fb.array((sousTaches || []).map((s: any) => this.createSousTacheGroup(s))));
      this.taskForm.setControl('etiquettes', this.fb.array((etiquettes || []).map((tag: string) => this.fb.control(tag))));
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    console.log('Submitting form with value:', this.taskForm.value);
    const payload = { ...this.taskForm.value } as any;

    payload.sousTaches = (payload.sousTaches ?? []).map((s: any) => ({
      ...s,
      echeance: s.echeance ? new Date(s.echeance).toISOString() : null,
    }));

    payload.etiquettes = (payload.etiquettes ?? []).filter((tag: any) => tag && typeof tag === 'string');

    payload.commentaires = (payload.commentaires ?? []).map((c: any) => ({
      ...c,
      date: c.date ? new Date(c.date).toISOString() : new Date().toISOString(),
    }));

    if (this.taskId) {
      this.putTask(payload);
    } else {
      this.postTask(payload);
    }
  }

  private postTask(task: Task): void {
    this.taskService.postTask(task).subscribe((data) => {
      if (this.task && this.task._id) {
        // Modal mode
        this.close.emit();
      } else {
        // Route mode
        this.router.navigate(['/tasks/', data._id]);
      }
    });
  }

  private putTask(task: Task): void {
    task._id = this.taskId;
    this.taskService.putTask(task).subscribe((data) => {
      if (this.task && this.task._id) {
        // Modal mode
        this.close.emit();
      } else {
        // Route mode
        this.router.navigate(['/tasks/', data._id]);
      }
    });
  }

  cancel(): void {
    if (this.task && this.task._id) {
      this.close.emit();
    } else {
      this.router.navigate(['/tasks']);
    }
  }
}