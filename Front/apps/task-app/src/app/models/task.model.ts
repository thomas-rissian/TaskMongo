import { Author } from "./author.model";

export interface Task {
    _id?: string; 
    titre: string;
    description: string;
    auteur: Author;
    dateCreation: string;
    sousTaches?: Task[];
    commentaires?: string[];
    historiqueModifications?: string[];
}