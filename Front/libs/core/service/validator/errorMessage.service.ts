import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ErrorMessageService {
  private defaultMessages: Record<string,string> = {
    required: 'Ce champ est requis.',
    minlength: 'Trop court.',
    maxlength: 'Trop long.',
    email: 'Email invalide.',
    pattern: 'Format invalide.',
    min: 'Valeur trop petite.',
    max: 'Valeur trop grande.',
  };

  getMessage(control: AbstractControl | null, customMessages?: Record<string,string>): string {
    if (!control) return '';
    const errors = control.errors ?? {};
    if (!Object.keys(errors).length) return '';

    const key = Object.keys(errors)[0];
    const payload = errors[key];

    if (payload && typeof payload === 'object' && typeof payload.message === 'string') {
      return payload.message;
    }

    if (customMessages && customMessages[key]) return customMessages[key];

    return this.defaultMessages[key] ?? key;
  }
}