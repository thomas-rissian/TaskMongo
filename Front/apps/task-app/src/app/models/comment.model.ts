import { Author } from './author.model';

export interface Commentaire {
  _id?: string;
  auteur: Author;
  date?: string;
  contenu: string;
}