import { ChangeDetectionStrategy, Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
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
  styleUrl: './textField.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextField),
      multi: true,
    },
  ],
})

export class TextField implements ControlValueAccessor {
  @Input({required: true}) placeholder: string = 'Enter text here';
  @Input({required: true}) type: InputType = 'text';
  @Input({required: true}) title: string = 'Text Field';
  @Input() error: string = '';

  value: string = '';
  isDisabled: boolean = false;

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(obj: any): void {
    this.value = obj || '';
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
  }
}