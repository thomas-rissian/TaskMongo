import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
export class TextAreaField implements ControlValueAccessor {
  @Input() placeholder: string = 'Enter text here';
  @Input() title: string = 'Text Field';
  @Input() error: string = '';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  isDisabled: boolean = false;

  onChange = (value: any) => {};
  onTouched = () => {};

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
