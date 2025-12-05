import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextAreaField } from "@libs/ui/inputs/textAreaField/textAreaField";
import { EditableContainer } from '@libs/ui/inputs/EditableContainer/EditableContainer';

@Component({
  selector: 'app-comment',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, TextAreaField, EditableContainer],

  templateUrl: './comment.html'
})
export class Comment {
  @Input({required: true}) commentForm!: FormGroup;
  error: string = "";
  newCommentText: string = "";

  commentEditList : string[] = [];

  getCommentText(): string[] {
    return this.commentForm.value;
  }

  getCommentByIndex(index: number): string {
    return this.getCommentText()[index];
  }

  addComment() {
    if (this.newCommentText.trim() === "") {
      this.error = "Comment cannot be empty.";
      return;
    }
    this.error = "";
    this.getCommentText().push(this.newCommentText);
    this.newCommentText = "";
  }

  updateComment(index: number) {
    const newText = this.commentEditList[index] || "";
    if (newText.trim() === "") {
      this.error = "Comment cannot be empty.";
      return;
    }
    this.resetComment(index);
    this.error = "";
    this.getCommentText()[index] = newText;
  }

  updateNewCommentText(index: number, newText: string) {
    this.commentEditList[index] = newText;
  }
  getNewCommentText(index: number): string {
    return this.commentEditList[index] || this.getCommentByIndex(index);
  }

  resetComment(index: number) {
    this.commentEditList[index] = "";
  }
  removeComment(index: number) {
    this.getCommentText().splice(index, 1);
  }

}
