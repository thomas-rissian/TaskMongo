import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TaskEditableContainer } from '@libs/ui/inputs/TaskEditableContainer/TaskEditableContainer';
import { TextAreaField } from '@libs/ui/component.lib.include';
import { CurrentUserService } from '@task-app/core/service/current-user.service';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, TaskEditableContainer, TextAreaField],
  templateUrl: './comment.html'
})
export class Comment {
  @Input({ required: true }) commentForm!: FormArray; 
  error: string = "";
  newCommentText: string = "";

  commentEditList: string[] = [];

  constructor(
    private fb: FormBuilder,
    private currentUserService: CurrentUserService
  ) {}

  getControls(): FormGroup[] {
    return (this.commentForm as FormArray).controls as FormGroup[];
  }

  getCommentByIndex(index: number): string {
    const grp = this.getControls()[index];
    return grp ? (grp.get('contenu')?.value ?? '') : '';
  }

  addComment() {
    const text = this.newCommentText?.trim() ?? '';
    if (!text) {
      this.error = "Comment cannot be empty.";
      return;
    }
    this.error = "";

    // Récupérer l'utilisateur actuel
    const currentUser = this.currentUserService.getUser();
    const auteur = currentUser || {
      nom: 'Anonyme',
      prenom: '',
      email: 'anonymous@example.com'
    };

    const group = this.fb.group({
      _id: [null],
      auteur: this.fb.group({
        nom: [auteur.nom, Validators.required],
        prenom: [auteur.prenom, Validators.required],
        email: [auteur.email, [Validators.required, Validators.email]]
      }),
      date: [new Date().toISOString()],
      contenu: [text, Validators.required]
    });

    (this.commentForm as FormArray).push(group);
    this.newCommentText = "";
  }

  updateComment(index: number) {
    const newText = (this.commentEditList[index] || "").trim();
    if (!newText) {
      this.error = "Comment cannot be empty.";
      return;
    }
    const grp = this.getControls()[index];
    grp.get('contenu')?.setValue(newText);
    grp.get('date')?.setValue(new Date().toISOString());
    this.resetComment(index);
    this.error = "";
  }

  updateNewCommentText(index: number, newText: string) {
    this.commentEditList[index] = newText;
  }

  getNewCommentText(index: number): string {
    const edit = this.commentEditList[index];
    if (typeof edit !== 'undefined' && edit !== '') return edit;
    return this.getCommentByIndex(index);
  }

  resetComment(index: number) {
    this.commentEditList[index] = "";
  }

  removeComment(index: number) {
    (this.commentForm as FormArray).removeAt(index);
    this.commentEditList.splice(index, 1);
  }
}