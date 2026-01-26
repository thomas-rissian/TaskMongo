import { HttpClient, HttpParams } from "@angular/common/http";
import { Task } from "../../models/task.model";
import { API_URL } from "../config/config";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

const BASE_URL = API_URL + '/tasks';

export interface TaskFilterParams {
  statut?: string;
  priorite?: string;
  categorie?: string;
  etiquette?: string;
  avant?: string;
  apres?: string;
  q?: string;
  tri?: string;
  ordre?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {

    constructor(private http: HttpClient) {}

    // Récupérer toutes les tâches
    getTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(BASE_URL);
    }

    // Rechercher et filtrer les tâches
    searchTasks(filters: TaskFilterParams): Observable<Task[]> {
        let params = new HttpParams();
        
        if (filters.statut) params = params.set('statut', filters.statut);
        if (filters.priorite) params = params.set('priorite', filters.priorite);
        if (filters.categorie) params = params.set('categorie', filters.categorie);
        if (filters.etiquette) params = params.set('etiquette', filters.etiquette);
        if (filters.avant) params = params.set('avant', filters.avant);
        if (filters.apres) params = params.set('apres', filters.apres);
        if (filters.q) params = params.set('q', filters.q);
        if (filters.tri) params = params.set('tri', filters.tri);
        if (filters.ordre) params = params.set('ordre', filters.ordre);

        return this.http.get<Task[]>(`${BASE_URL}/search`, { params });
    }

    // Récupérer une tâche par ID
    getTaskById(id: string): Observable<any> {
        return this.http.get<any>(`${BASE_URL}/${id}`);
    }

    // Créer une tâche
    postTask(task: Task): Observable<Task> {
        return this.http.post<Task>(BASE_URL, task);
    }

    // Mettre à jour une tâche
    putTask(task: Task): Observable<Task> {
        return this.http.put<Task>(`${BASE_URL}/${task._id}`, task);
    }

    // Mettre à jour une tâche avec ID séparé (pour éviter d'inclure _id dans le payload)
    putTaskWithId(id: string | undefined, task: any): Observable<Task> {
        return this.http.put<Task>(`${BASE_URL}/${id}`, task);
    }

    // Supprimer une tâche
    deleteTask(id: string): Observable<void> {
        return this.http.delete<void>(`${BASE_URL}/${id}`);
    }
}