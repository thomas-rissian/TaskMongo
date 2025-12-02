import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Loader } from '@libs/ui/component.lib.include';
import { TasksService } from '@task-app/core/service/tasks.service';
import { Task } from '@task-app/models/task.model';

@Component({
  selector: 'app-task-detail',
  imports: [Loader],
  templateUrl: './task-detail.html',
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
