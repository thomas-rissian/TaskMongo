import { HttpClient } from "@angular/common/http";
import { API_URL } from "../config/config";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

const BASE_URL = API_URL + '/tasks';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

    constructor(private http: HttpClient) {}

    // Récupérer l'historique des modifications d'une tâche
    getTaskHistory(taskId: string): Observable<any> {
        return this.http.get<any>(`${BASE_URL}/${taskId}/history`);
    }
}
