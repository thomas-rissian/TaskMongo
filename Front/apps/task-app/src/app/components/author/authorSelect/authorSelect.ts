import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SelectField } from "@libs/ui/inputs/selectField/selectField";
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Author } from '../../../models/author.model';
import { AuthorsService } from '../../../core/service/authors.service';
import { AuthorEdit } from "../authorEdit/authorEdit";

@Component({
  selector: 'app-author-select',
  imports: [SelectField, FormsModule, ReactiveFormsModule, AuthorEdit],
  templateUrl: './authorSelect.html',
})
export class AuthorSelect {
  IsAuthorFormVisible: boolean = false;
  
  @Input({ required: true }) authorGroup!: FormGroup;
  @Input({ required: true })
  getError!: (error: string) => string;

  authorList : Author[] = [];
  
  constructor(private authorService: AuthorsService) {
    authorService.getAuthors().subscribe((authors) => {
      this.authorList = authors;
    });
  }

  showAuthorForm(isNone: boolean) {
    this.IsAuthorFormVisible = isNone;
    if(isNone){
      this.authorGroup.reset();
    }
    
  }
}
