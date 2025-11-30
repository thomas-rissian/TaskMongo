import {  Component, inject, OnInit, signal } from '@angular/core';
import { Task } from '../../../models/task.model';
import { TasksService } from '../../../core/service/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextField } from "../../../components/inputs/textField/textField";

@Component({
  selector: 'app-task-form',
  imports: [TextField, ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  taskForm!: FormGroup;
  
  task:Task | undefined;
  taskId: string = this.activatedRoute.snapshot.params['id'];

  constructor(private fb: FormBuilder,private taskService: TasksService,
    private router: Router) {
    this.taskForm = this.fb.group({
        titre: ['', [Validators.required, Validators.minLength(3)]],
        description: [''],
        dateLimite: [null],
        emailAuteur: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      auteur: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]]
      })
    });

    this.LoadTask();
  }
  getError(controlName: string): string {
    const control = this.taskForm.get(controlName);
    if (control?.invalid && control?.touched) {
      if (control.hasError('required')) return 'Ce champ est requis.';
      if (control.hasError('minlength')) return 'Trop court.';
      if (control.hasError('email')) return 'Email invalide.';
    }
    return '';
  }
  LoadTask() {
    if(!this.taskId)
      return;

    this.taskService.getTaskById(this.taskId).subscribe((data) => {
      this.task = data;
    });
  }

  async onSubmit() {
    const formData = this.taskForm.value;
    console.log(formData);
    //if(this.taskForm.valid) {
    //  if(this.taskId)
    //    await this.putTask(formData);
    //  else
    //    await this.postTask(formData);
    //}
  }

  private async postTask(task: Task) {
    this.taskService.postTask(task).subscribe((data) => {
      this.router.navigate(['/tasks/', data._id]);
    });
  }

  private async putTask(task: Task) {
    this.taskService.putTask(task).subscribe((data) => {
      this.router.navigate(['/tasks/', data._id]);
    });
  } 
}
