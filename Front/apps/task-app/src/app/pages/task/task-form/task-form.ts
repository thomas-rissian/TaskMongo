import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../../models/task.model';
import { TasksService } from '../../../core/service/tasks.service';
import { TextField } from '@libs/ui/inputs/textField/textField';
import { AuthorEdit } from "../../../components/authorEdit/authorEdit";

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, TextField, AuthorEdit],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  
  taskForm!: FormGroup;
  task: Task | undefined;
  taskId: string = this.activatedRoute.snapshot.params['id'];
 
  private errorMessages: { [key: string]: string } = {
    required: 'Ce champ est requis.',
    minlength: 'Trop court.',
    maxlength: 'Trop long.',
    email: 'Email invalide.',
    pattern: 'Format invalide.',
    min: 'Valeur trop petite.',
    max: 'Valeur trop grande.',
  };

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

  getError(controlName: string): string {
    const control = this.taskForm.get(controlName);
    if (control?.invalid && (control?.touched || control?.dirty)) {
      const errorKey = Object.keys(control.errors || {})[0];
      return this.errorMessages[errorKey] || 'Erreur de validation.';
    }
    return '';
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