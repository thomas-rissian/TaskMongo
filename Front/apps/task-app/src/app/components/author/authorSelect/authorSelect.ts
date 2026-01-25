import { ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
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
export class AuthorSelect implements OnInit, AfterViewInit, OnDestroy {
  IsAuthorFormVisible: boolean = false;
  
  @Input({ required: true }) 
  authorGroup!: FormGroup;

  authorList : Author[] = [];
  @ViewChild(SelectField) selectField?: SelectField;
  private subs: Array<any> = [];
  
  constructor(private authorService: AuthorsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.authorService.getAuthors().subscribe((authors) => {
      this.authorList = authors;
      this.updateSelectionFromForm();
      // If the subscription emits synchronously during bootstrap, detect changes now to avoid expression changed errors
      try { this.cdr.detectChanges(); } catch (e) { /* no-op */ }
    });
    // subscribe to formGroup changes to reflect value updates into the UI
    if (this.authorGroup && this.authorGroup.valueChanges) {
      const s = this.authorGroup.valueChanges.subscribe(() => {
        this.updateSelectionFromForm();
      });
      this.subs.push(s);
    }
  }

  ngAfterViewInit(): void {
    // If there is an initial value (e.g., when editing a task), reflect it in the select
    this.updateSelectionFromForm();
    // also react to when the user selects an author via the UI
    if (this.selectField) {
      const s = (this.selectField as any).valueChange?.subscribe((item: any) => {
        if (item) {
          // patch the nested authorGroup with the selection
          if (this.authorGroup) {
            // Avoid updating if identical to prevent triggering a loop
            const cur = this.authorGroup.value;
            if (!cur || cur.email !== item.email) {
              this.authorGroup.patchValue(item);
              // Afficher automatiquement le formulaire d'édition
              this.IsAuthorFormVisible = true;
            }
          }
        }
      });
      if (s) this.subs.push(s);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe && s.unsubscribe());
  }

  showAuthorForm(isNone: boolean) {
    this.IsAuthorFormVisible = isNone;
    if(isNone){
      this.authorGroup.reset();
    }
  }

  private updateSelectionFromForm(): void {
    if (!this.selectField || !this.authorGroup) return;
    const current = this.authorGroup.value;
    if (!current) return;
    // Find author by email (unique in model) or by name
    const candidate = this.authorList.find(a => a.email === current.email) ?? this.authorList.find(a => (a.nom === current.nom && a.prenom === current.prenom));
    if (candidate) {
      // Avoid recursion: only update select value programmatically via writeValue
      // if it differs from the current UI value. writeValue does not emit valueChange.
      try {
        const current = (this.selectField as any)?.value;
        const isSame = current && current.email === candidate.email;
        if (!isSame) {
          this.selectField?.writeValue(candidate);
        }
      } catch (e) {
        try { this.selectField?.writeValue(candidate); } catch (err) { /* no-op */ }
      }
    } else {
      // If the form doesn't have an author, ensure the select has 'none' state without emitting user events
      try {
        this.selectField?.writeValue({ [this.selectField?.paramData?.[0] ?? 'none']: 'none' });
      } catch (e) { /* no-op */ }
    }
  }
}
