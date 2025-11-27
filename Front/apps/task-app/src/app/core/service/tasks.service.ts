import { HttpClient } from "@angular/common/http";
import { Task } from "../../models/task.model";
import { API_URL } from "../config/config";
import { Observable } from "rxjs";

const BASE_URL = API_URL + '/tasks';
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
}