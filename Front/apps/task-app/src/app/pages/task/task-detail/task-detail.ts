import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Loader } from '@libs/ui/component.lib.include';
import { TasksService } from '@task-app/core/service/tasks.service';
import { Task } from '@task-app/models/task.model';
import { priorityType } from '@task-app/models/priority.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [Loader, CommonModule, DatePipe],
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
        this.cdr.detectChanges();
      }
    });
  }

  getPriorityClass(priority: priorityType | undefined): string {
    if (!priority) return 'bg-gray-100 text-gray-800';
    
    const classes: { [key in priorityType]: string } = {
      'Urgent': 'bg-red-100 text-red-800',
      'Haute': 'bg-orange-100 text-orange-800',
      'Moyenne': 'bg-yellow-100 text-yellow-800',
      'Basse': 'bg-green-100 text-green-800',
    };
    
    return classes[priority] || 'bg-gray-100 text-gray-800';
  }

  getCompletedSubtasks(): number {
    if (!this.task?.sousTaches) return 0;
    return this.task.sousTaches.filter(st => st.statut === 'Done').length;
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
