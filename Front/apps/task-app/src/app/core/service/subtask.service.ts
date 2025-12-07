import { HttpClient } from "@angular/common/http";
import { Task } from "../../models/task.model";
import { API_URL } from "../config/config";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Subtask } from "@task-app/models/subtask.model";

const BASE_URL = API_URL + '/tasks';
@Injectable({
  providedIn: 'root'
})
export class SubtaskService {

    constructor(private http: HttpClient) {}

    // api/subtasks
    getSubtasks(): Observable<Subtask[]> {
        return this.http.get<Subtask[]>(BASE_URL);
    }
    // api/subtasks/:id
    getSubtaskById(id: string): Observable<Subtask> {
        return this.http.get<Subtask>(`${BASE_URL}/${id}`);
    }
    // api/subtasks
    postSubtask(task: Subtask): Observable<any> {
        return this.http.post<any>(BASE_URL, task);
    }
    // api/subtasks/:id
    putSubtask(task: Subtask): Observable<any> {
        return this.http.put<any>(`${BASE_URL}/${task._id}`, task);
    }
    // api/subtasks/:id
    deleteSubtask(id: string): Observable<void> {
        return this.http.delete<void>(`${BASE_URL}/${id}`);
    }
}