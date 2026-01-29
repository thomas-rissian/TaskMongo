import { Component, EventEmitter, forwardRef, Input, Output, ElementRef, HostListener, Injector, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ErrorMessageService } from '../../../core/service/validator/errorMessage.service';

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
export class SelectSimpleField implements ControlValueAccessor, OnInit, OnDestroy {
  isOpen = false;
  value: any = null;
  error = '';
  isDisabled = false;
  
  @Input() title = '';
  @Input() data: any[] = [];
  @Input() listField: string[] = [];
  @Input() paramData: string[] = [];

  @Output() noneSelect = new EventEmitter<boolean>();

  private onChangeFn: (v: any) => void = () => {};
  private onTouchedFn: () => void = () => {};

  private subs: Subscription[] = [];
  private ngControlRef?: NgControl | null;

  constructor(private elementRef: ElementRef, private injector: Injector, private cd: ChangeDetectorRef, private errorMessageService: ErrorMessageService) {}

  ngOnInit(): void {
    this.ngControlRef = this.injector.get(NgControl, null);
    if (this.ngControlRef) {
      this.ngControlRef.valueAccessor = this;
    }

    const c = this.control;
    if (!c) return;
    if (c.statusChanges) this.subs.push(c.statusChanges.subscribe(() => this.cd.markForCheck()));
    if (c.valueChanges) this.subs.push(c.valueChanges.subscribe(() => this.cd.markForCheck()));
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  get control(): AbstractControl | null {
    return this.ngControlRef?.control ?? null;
  }

  get errorMessage(): string {
    return this.errorMessageService.getMessage(this.control);
  }

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
    this.error = this.errorMessageService.getMessage(this.control);
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