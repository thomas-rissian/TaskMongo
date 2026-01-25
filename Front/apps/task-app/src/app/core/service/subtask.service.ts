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

    // Créer une sous-tâche
    createSubtask(taskId: string, subtask: Subtask): Observable<any> {
        return this.http.post<any>(`${BASE_URL}/${taskId}/sousTaches`, subtask);
    }

    // Mettre à jour une sous-tâche
    updateSubtask(taskId: string, subtaskId: string, subtask: Subtask): Observable<any> {
        return this.http.put<any>(`${BASE_URL}/${taskId}/sousTaches/${subtaskId}`, subtask);
    }

    // Supprimer une sous-tâche
    deleteSubtask(taskId: string, subtaskId: string): Observable<void> {
        return this.http.delete<void>(`${BASE_URL}/${taskId}/sousTaches/${subtaskId}`);
    }
}