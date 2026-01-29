import { HttpClient } from "@angular/common/http";
import { Commentaire } from "../../models/comment.model";
import { API_URL } from "../config/config";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

const BASE_URL = API_URL + '/tasks';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

    constructor(private http: HttpClient) {}

    // Créer un commentaire
    createComment(taskId: string, comment: Commentaire): Observable<any> {
        return this.http.post<any>(`${BASE_URL}/${taskId}/commentaires`, comment);
    }

    // Supprimer un commentaire
    deleteComment(taskId: string, commentId: string): Observable<any> {
        return this.http.delete<any>(`${BASE_URL}/${taskId}/commentaires/${commentId}`);
    }
}
