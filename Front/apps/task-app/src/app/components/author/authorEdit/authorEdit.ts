import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EditableContainer } from '@libs/ui/inputs/EditableContainer/EditableContainer';
import { TextField } from '@libs/ui/inputs/textField/textField';
import { Author } from '../../../models/author.model';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-author-edit',
  imports: [EditableContainer, TextField, FormsModule, ReactiveFormsModule],
  templateUrl: './authorEdit.html',
})
export class AuthorEdit { 
  @Input({ required: true }) authorGroup!: FormGroup;
  @Input() error: string = "";
  @Input({ required: true })
  getError!: (error: string) => string;

  private savedValues: Author| undefined = undefined;

  getAuthorError(controlName: string): string {
    return this.getError("auteur." + controlName) || "";
  }

  onModeChange(isEditing: boolean): void {
    if (isEditing) {
      this.savedValues = this.authorGroup.getRawValue();
    }
  }

  onCancel(): void {
    if (this.savedValues) {
      this.authorGroup.patchValue(this.savedValues);
    }
  }

  onSave(): void {
    if (this.authorGroup.valid) {
      this.savedValues = this.authorGroup.getRawValue();
    } else {
      this.authorGroup.patchValue(this.savedValues ||{});
    }
  }

  hasErrors(): boolean {
    return this.authorGroup.invalid;
  }
}