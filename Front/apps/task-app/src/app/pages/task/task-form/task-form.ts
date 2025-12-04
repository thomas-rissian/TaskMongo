import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PRIORITY, STATUS, Task } from '@task-app/models/model.include.model';
import { Comment, AuthorSelect } from '@task-app/components/component.include';
import { TasksService } from '@task-app/core/service/tasks.service';
import { arrayValidator } from '@task-app/core/validator/array.validator';
import { SelectSimpleField, TextField } from '@libs/ui/component.lib.include';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, TextField, AuthorSelect, SelectSimpleField, Comment],
  templateUrl: './task-form.html',
})
export class TaskForm implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  PRIORITY: string[] = PRIORITY;
  STATUS: string[] = STATUS;

  taskForm!: FormGroup;
  task: Task | undefined;
  taskId: string = this.activatedRoute.snapshot.params['id'];
 
  constructor(
    private fb: FormBuilder,
    private taskService: TasksService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTask();
  }

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
      status: ['', [Validators.required, arrayValidator(STATUS)]],
      priorite: ['', [Validators.required, arrayValidator(PRIORITY)]],
    });
  
  }

  private loadTask(): void {
    if (!this.taskId) return;

    this.taskService.getTaskById(this.taskId).subscribe((data) => {
      this.task = data;
      this.taskForm.patchValue({
        ...data
      });
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.value;

    if (this.taskId) {
      this.putTask({ ...formValue, _id: this.taskId });
    } else {
      this.postTask(formValue);
    }
  }

  private postTask(task: Task): void {
    this.taskService.postTask(task).subscribe((data) => {
      this.router.navigate(['/tasks/', data._id]);
    });
  }

  private putTask(task: Task): void {
    this.taskService.putTask(task).subscribe((data) => {
      this.router.navigate(['/tasks/', data._id]);
    });
  }
}