import { Component, EventEmitter, forwardRef, Input, Output, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select-simple-field',
  standalone: true,
  imports: [CommonModule ],
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
  
  @Input() title = '';
  @Input() data: any[] = [];
  @Input() listField: string[] = [];
  @Input() paramData: string[] = [];

  @Input() errorField = '';
  @Input() errorFunc?: (field: string) => string;

  @Output() noneSelect = new EventEmitter<boolean>();

  private onChangeFn: (v: any) => void = () => {};
  private onTouchedFn: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  toggleOpen() {
    if (this.isDisabled) return;
    this.isOpen = !this.isOpen;
  }

  selectItem(item: any) {
    if (this.isDisabled) return;
    this.value = item;
    this.isOpen = false;
    this.onChangeFn(item);
    this.onTouchedFn();
    this.updateError();
    this.noneSelect.emit(false);
  }

  selectNone() {
    if (this.isDisabled) return;
    this.value = null;
    this.isOpen = false;
    this.onChangeFn(null);
    this.onTouchedFn();
    this.updateError();
    this.noneSelect.emit(true);
  }

  writeValue(obj: any): void {
    this.value = obj ?? null;
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
    if (a == null && b == null) return true;
    if (a === b) return true;
    if (a && b && typeof a === 'object' && typeof b === 'object') {
      return JSON.stringify(a) === JSON.stringify(b);
    }
    return false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isDisabled) return;
    const target = event.target as Node;
    if (!this.elementRef.nativeElement.contains(target) && this.isOpen) {
      this.isOpen = false;
      this.onTouchedFn();
      this.updateError();
    }
  }
}