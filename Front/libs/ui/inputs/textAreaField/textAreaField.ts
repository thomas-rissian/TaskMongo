import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output, Injector, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ErrorMessageService } from '../../../core/service/validator/errorMessage.service';

@Component({
  selector: 'app-text-area-field',
  templateUrl: './textAreaField.html',
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaField),
      multi: true,
    },
  ],
})
export class TextAreaField implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() placeholder: string = 'Enter text here';
  @Input() title: string = 'Text Field';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  isDisabled: boolean = false;

  onChange = (value: any) => {};
  onTouched = () => {};

  private subs: Subscription[] = [];
  private ngControlRef?: NgControl | null;

  constructor(private injector: Injector, private cd: ChangeDetectorRef, private errorMessageService: ErrorMessageService) {}

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

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInput(event: Event): void {
    const val = (event.target as HTMLTextAreaElement).value;
    this.value = val;
    this.onChange(val);
    this.valueChange.emit(val)
  }

  onBlur(): void {
    this.onTouched();
  }
}
