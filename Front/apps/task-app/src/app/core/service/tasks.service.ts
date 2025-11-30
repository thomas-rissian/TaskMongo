import { HttpClient } from "@angular/common/http";
import { Task } from "../../models/task.model";
import { API_URL } from "../config/config";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

const BASE_URL = API_URL + '/tasks';
@Injectable({
  providedIn: 'root'
})
export class TasksService {

    constructor(private http: HttpClient) {}

    // api/tasks
    getTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(BASE_URL);
    }
    // api/tasks/:id
    getTaskById(id: string): Observable<Task> {
        return this.http.get<Task>(`${BASE_URL}/${id}`);
    }
    // api/tasks
    postTask(task: Task): Observable<Task> {
        return this.http.post<Task>(BASE_URL, task);
    }
    // api/tasks/:id
    putTask(task: Task): Observable<Task> {
        return this.http.put<Task>(`${BASE_URL}/${task._id}`, task);
    }
    // api/tasks/:id
    deleteTask(id: string): Observable<void> {
        return this.http.delete<void>(`${BASE_URL}/${id}`);
    }
}