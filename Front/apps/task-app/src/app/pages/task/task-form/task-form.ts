import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Loader } from "../../../../../../../libs/ui/loader/loader";
import { Task } from '../../../models/task.model';
import { TasksService } from '../../../core/service/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { form, Field } from '@angular/forms/signals';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  imports: [Loader, Field],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskForm implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  
  task:Task | undefined;
  taskId: string = this.activatedRoute.snapshot.params['id'];
  taskForm!: FormGroup;

  constructor(private fb: FormBuilder,private taskService: TasksService,
     private router: Router) {}

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

  LoadTask() {
    if(!this.taskId)
      return;

    this.taskService.getTaskById(this.taskId).subscribe((data) => {
      this.task = data;
    });
  }

  async onSubmit() {
    const formData = this.taskForm.value;
    if(this.taskForm.valid) {
      if(this.taskId)
        await this.putTask(formData);
      else
        await this.postTask(formData);
    }
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
