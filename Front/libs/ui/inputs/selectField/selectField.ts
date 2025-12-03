import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, Output } from '@angular/core';
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
  constructor(private elementRef: ElementRef) {} 
  
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
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as Node;
    if (!this.elementRef.nativeElement.contains(target) && this.isOpen) {
      this.isOpen = false;
    }

  }
}
