import { Author } from "../../models/author.model";
import { API_URL } from "../config/config";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

const BASE_URL = API_URL + '/authors';
@Injectable({
  providedIn: 'root'
})
export class AuthorsService {

    constructor(private http: HttpClient) {}

    getAuthors(): Observable<Author[]> {
        return this.http.get<Author[]>(BASE_URL);
    }
}