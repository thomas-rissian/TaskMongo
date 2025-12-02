import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select-simple-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-simple-field.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectSimpleField),
      multi: true,
    },
  ],
})
export class SelectSimpleField implements ControlValueAccessor {
  isOpen = false;
  value: any = null;
  error = '';
  isDisabled = false;

  @Input({ required: true }) data: any[] = [];
  @Input({ required: true }) listField: string[] = [];
  @Input({ required: false }) paramData: string[] = [];

  @Input() errorField = '';
  @Input() errorFunc?: (field: string) => string;

  @Output() noneSelect = new EventEmitter<boolean>();

  private onChangeFn: (v: any) => void = () => {};
  private onTouchedFn: () => void = () => {};

  toggleOpen() {
    if (this.isDisabled) return; // CORRECTION: stop if disabled
    this.isOpen = !this.isOpen;
  }

  selectItem(item: any) {
    if (this.isDisabled) return; // CORRECTION: stop if disabled
    this.value = item;
    this.isOpen = false;
    this.onChangeFn(item);
    this.onTouchedFn();
    this.updateError();
    this.noneSelect.emit(false);
    console.log('[SelectSimpleField] selectItem', { item, value: this.value, error: this.error });
  }

  selectNone() {
    if (this.isDisabled) return; // CORRECTION: stop if disabled
    this.value = null;
    this.isOpen = false;
    this.onChangeFn(null);
    this.onTouchedFn();
    this.updateError();
    this.noneSelect.emit(true);
    console.log('[SelectSimpleField] selectNone', { value: this.value, error: this.error });
  }

  writeValue(obj: any): void {
    this.value = obj ?? null;
    // Mise à jour de l'erreur en micro-tâche pour éviter "ExpressionChangedAfterItHasBeenCheckedError"
    Promise.resolve().then(() => this.updateError());
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  private updateError(): void {
    this.error = this.errorFunc ? (this.errorFunc(this.errorField) ?? '') : '';
  }

  equals(a: any, b: any): boolean {
    if (a === b) return true;
    if (a && b && typeof a === 'object' && typeof b === 'object') {
      return JSON.stringify(a) === JSON.stringify(b);
    }
    return false;
  }
}