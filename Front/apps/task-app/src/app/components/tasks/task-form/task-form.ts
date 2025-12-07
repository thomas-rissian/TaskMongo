import { Component, inject, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PRIORITY, STATUS, Task } from '@task-app/models/model.include.model';
import { Comment, AuthorSelect } from '@task-app/components/component.include';
import { TasksService } from '@task-app/core/service/tasks.service';
import { arrayValidator } from '@task-app/core/validator/array.validator';
import { SelectSimpleField, TextField, TextAreaField } from '@libs/ui/component.lib.include';
import { Substack } from "@task-app/components/substack/substack";
import { Etiquettes } from "@task-app/components/etiquettes/etiquettes";

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AuthorSelect, SelectSimpleField, Comment, Substack, Etiquettes, TextField, TextAreaField],
  templateUrl: './task-form.html',
})
export class TaskForm implements OnInit, OnChanges {
  constructor() {
    // Initialize the reactive form as early as possible so ngOnChanges
    // and the template have a valid FormGroup instance available.
    this.initForm();
  }

  @Output() close = new EventEmitter<void>();
  
  private activatedRoute = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private taskService = inject(TasksService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  PRIORITY: string[] = PRIORITY;
  STATUS: string[] = STATUS;

  taskForm!: FormGroup;
  @Input() task: Task | null | undefined;
  taskId: string | undefined;

  ngOnInit(): void {
    this.initForm();
    // If a task Input is present and has _id, initialize the form with it
    if (this.task && this.task._id) {
      this.loadForm();
      return;
    }
    this.taskId = this.activatedRoute.snapshot.params['id'] || undefined;
    if (this.taskId) {
      this.loadTask();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If form hasn't been initialized yet, make sure it exists
    if (!this.taskForm) this.initForm();
    if (changes['task'] && changes['task'].currentValue) {
      this.task = changes['task'].currentValue;
      this.loadForm();
    }
  }

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
      echeance: [null, [Validators.required]],
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
    if (!this.taskId){
      this.loadForm();
      return; 
    }

    this.taskService.getTaskById(this.taskId).subscribe((data) => {
      this.task = data;
      this.loadForm();
    });
  }
  private loadForm(): void {
    if (!this.task) {
      this.taskForm.setControl('commentaires', this.fb.array([]));
      this.taskForm.setControl('sousTaches', this.fb.array([]));
      this.taskForm.setControl('etiquettes', this.fb.array([]));
      this.cdr.detectChanges();
      return;
    }
    const { commentaires, sousTaches, etiquettes, historiqueModifications, ...simple } = this.task;
    simple.echeance = this.toInputDateValue((simple as any).echeance) ?? undefined;
    this.taskForm.patchValue(simple);

    this.taskForm.setControl('commentaires', this.fb.array((commentaires || []).map((c: any) => this.createCommentaireGroup(c))));
    this.taskForm.setControl('sousTaches', this.fb.array((sousTaches || []).map((s: any) => this.createSousTacheGroup(s))));
    this.taskForm.setControl('etiquettes', this.fb.array((etiquettes || []).map((tag: string) => this.fb.control(tag))));
    this.cdr.detectChanges();

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

    // convert root task echeance back to ISO for backend
    payload.echeance = payload.echeance ? new Date(payload.echeance).toISOString() : null;

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
      if (this.task) {
        // Modal mode: emit close to let parent handle refreshing
        this.close.emit();
        return;
      }
      // Route mode: navigate to created task
      this.router.navigate(['/tasks/', data._id]);
    });
  }

  private putTask(task: Task): void {
    task._id = this.taskId;
    this.taskService.putTask(task).subscribe((data) => {
      if (this.task) {
        this.close.emit();
        return;
      }
      this.router.navigate(['/tasks/', data._id]);
    });
  }

  cancel(): void {
    if (this.task) {
      this.close.emit();
      return;
    }
    this.router.navigate(['/tasks']);
  }
}