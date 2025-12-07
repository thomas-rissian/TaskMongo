import { Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, Output, Injector, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ErrorMessageService } from '../../../core/service/validator/errorMessage.service';

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
export class SelectField implements ControlValueAccessor, OnInit, OnDestroy {
  isOpen = false;
  value : any = null;

  @Input() title: string = '';
  error: string = '';

  @Input({required: true}) data : any[] = [];
  @Input({required:true}) paramData : string[] = [];

  @Output() noneSelect = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<any>();

  private onChangeFn: (v: any) => void = () => {};
  private onTouchedFn: () => void = () => {};

  private subs: Subscription[] = [];
  private ngControlRef?: NgControl | null;

  constructor(
    private elementRef: ElementRef,
    private injector: Injector,
    private cd: ChangeDetectorRef,
    private errorMessageService: ErrorMessageService
  ) {
    this.selectNone();
    this.updateError();
  } 
  
  ngOnInit() {
    this.ngControlRef = this.injector.get(NgControl, null);
    if (this.ngControlRef) {
      this.ngControlRef.valueAccessor = this;
    }

    const c = this.control;
    
    if (!c) return;
    if (c.statusChanges) this.subs.push(c.statusChanges.subscribe(() => this.cd.markForCheck()));
    if (c.valueChanges) this.subs.push(c.valueChanges.subscribe(() => this.cd.markForCheck()));
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }

  get control(): AbstractControl | null {
    return this.ngControlRef?.control ?? null;
  }

  get errorMessage(): string {
    return this.errorMessageService.getMessage(this.control);
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
    this.updateError();
  }

  selectItem(item: any) {
    this.value = item;
    this.isOpen = false;
    this.noneSelect.emit(false);
    this.valueChange.emit(item);
    this.onChangeFn(item);
    this.onTouchedFn();
    this.updateError();
  }
  selectNone() {
    this.value = { [this.paramData?.[0] ?? 'none']: "none" };
    this.isOpen = false;
    this.noneSelect.emit(true);
    this.valueChange.emit(this.value);
    this.onChangeFn(this.value);
    this.onTouchedFn();
    this.updateError();
  }

  private updateError(): void {
    const fromService = this.errorMessageService.getMessage(this.control);
    if (fromService) {
      this.error = fromService;
      return;
    }
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as Node;
    if (!this.elementRef.nativeElement.contains(target) && this.isOpen) {
      this.isOpen = false;
      this.updateError();
    }
  }
}