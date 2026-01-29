import { Component, Input, forwardRef, Optional, Self, OnInit, OnDestroy, ChangeDetectorRef, Injector } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ErrorMessageService } from '../../../core/service/validator/errorMessage.service';

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'date'
  | 'datetime-local'
  | 'time'
  | 'tel'
  | 'url'
  | 'search'
  | 'color'
  | 'range'
  | 'month'
  | 'week';

@Component({
  selector: 'app-text-field',
  standalone: true,
  templateUrl: './textField.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextField),
      multi: true,
    },
  ],
})
export class TextField implements ControlValueAccessor, OnInit, OnDestroy {
  @Input({ required: true }) placeholder: string = 'Enter text here';
  @Input({ required: true }) type: InputType = 'text';
  @Input({ required: true }) title: string = 'Text Field';

  value: string = '';
  isDisabled: boolean = false;

  onChange = (value: any) => {};
  onTouched = () => {};

  private subs: Subscription[] = [];

  private ngControlRef?: NgControl | null;

  constructor(
    private cd: ChangeDetectorRef,
    private injector: Injector, 
    private errorMessageService: ErrorMessageService
  ) {}

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

  writeValue(obj: any): void {
    this.value = obj ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  onBlur(): void {
    this.onTouched();
    this.control?.markAsTouched();
  }
}