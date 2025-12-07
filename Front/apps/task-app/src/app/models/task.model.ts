import { Author } from './author.model';
import { Subtask } from './subtask.model';
import { Commentaire } from './comment.model';
import { statusType } from './status.model';
import { priorityType } from './priority.model';
import { Historique } from './history.model';

export interface Task {
  _id?: string;
  titre: string;
  description?: string;
  dateCreation?: string;
  echeance?: string;
  statut?: statusType;
  priorite?: priorityType;
  auteur: Author;
  categorie?: string;
  etiquettes?: string[];
  sousTaches?: Subtask[];
  commentaires?: Commentaire[];
  historiqueModifications?: Historique[];
}