import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import {  NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select-field',
  imports: [],
  templateUrl: './selectField.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectField),
      multi: true,
    },
  ],
})
export class SelectField {
  isOpen = false;
  value : any = null;
  @Input({required: true}) data : any[] = [];

  @Input({ required: true })
  @Input({required:true})paramData : string[] = [];

  @Output() noneSelect = new EventEmitter<boolean>();

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  selectItem(item: any) {
    this.value = item;
    this.isOpen = false;
    this.noneSelect.emit(false);
  }
  selectNone() {
    this.value = { [this.paramData?.[0] ?? 'none']: "none" };
    this.isOpen = false;
    this.noneSelect.emit(true);
  }
}
