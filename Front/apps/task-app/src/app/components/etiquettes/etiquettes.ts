import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormArray, FormBuilder, FormControl } from "@angular/forms";
import { TextField } from "@libs/ui/inputs/textField/textField";

@Component({
  selector: 'app-etiquettes',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, TextField],
  templateUrl: './etiquettes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Etiquettes {
  @Input() etiquettes: string[] | FormArray = []; 
  newEtiquetteControl = new FormControl('');

  constructor(private fb: FormBuilder) {}

  get newEtiquette(): string {
    return this.newEtiquetteControl.value ?? '';
  }

  addEtiquette(): void {
    const val = (this.newEtiquette ?? '').trim();
    if (!val || this.getEtiquettesList().includes(val)) return;

    if (this.etiquettes instanceof FormArray) {
      this.etiquettes.push(this.fb.control(val));
    } else {
      (this.etiquettes as any).push(val);
    }

    this.newEtiquetteControl.reset();
  }

  removeEtiquette(index: number): void {
    if (this.etiquettes instanceof FormArray) {
      this.etiquettes.removeAt(index);
    } else {
      (this.etiquettes as any).splice(index, 1);
    }
  }

  getEtiquettesList(): string[] {
    if (this.etiquettes instanceof FormArray) {
      return this.etiquettes.getRawValue();
    }
    return (this.etiquettes as any) ?? [];
  }

  getIndex(tag: string): number {
    return this.getEtiquettesList().indexOf(tag);
  }
}