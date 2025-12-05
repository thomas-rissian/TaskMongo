import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Author } from "./author.model";
import { priorityType } from "./priority.model";
import { statusType } from "./status.model";


export interface Task {
    _id?: string; 
    titre: string;
    description: string;
    status: statusType;
    priorite: priorityType;
    auteur: Author;
    dateCreation: string;
    sousTaches?: Task[];
    commentaires?: string[];
    historiqueModifications?: string[];
    etiquettes?: string[];
}
