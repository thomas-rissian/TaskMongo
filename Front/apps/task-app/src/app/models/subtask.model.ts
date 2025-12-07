import { statusType } from './status.model';

export interface Subtask {
  _id?: string;
  titre: string;
  statut?: statusType;
  echeance?: string;
}