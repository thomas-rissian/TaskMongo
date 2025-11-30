import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { TasksService } from '../../../core/service/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../../models/task.model';
import { Loader } from '@libs/ui/loader/loader';

@Component({
  selector: 'app-task-detail',
  imports: [Loader],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail implements OnInit {
  @ViewChild(Loader) loader!: Loader;
  
  private activatedRoute = inject(ActivatedRoute);
  id: string = this.activatedRoute.snapshot.params['id'];
  task: Task | undefined;

  constructor(private tasksService: TasksService, private cdr: ChangeDetectorRef, 
    private router: Router) {}
    
  ngOnInit(): void {
    this.loadTask();
  }

  loadTask() {
    this.tasksService.getTaskById(this.id).subscribe((data) => {
      if(data) {
        this.task = data;
        this.loader.hide();
        this.cdr.detectChanges();
      }
    });
  }
  onEdit() {
    this.router.navigate([`/tasks/edit/${this.id}`]);
  }
  onDelete() {
    this.tasksService.deleteTask(this.id).subscribe(() => {
      this.router.navigate(['/tasks']);
    });
  }

  onBack() {
    this.router.navigate(['/tasks']);
  }
}
