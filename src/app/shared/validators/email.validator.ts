import { AbstractControl, ValidationErrors, Validators } from '@angular/forms'

/**
 * Check for "emails" that don't have a domain.tld after the @
 * The email RFC says that jerry@localhost is valid, but for our use-cases we don't want it
 */
const TLD_CHECK = /@.+\..+$/

export function validateEmail(control: AbstractControl): ValidationErrors | undefined {
  return (control.value !== '' && control.value !== null && control.value.length >= 6
    && (!TLD_CHECK.test(control.value) || Validators.email(control))
  ) ? { email_format: true } : undefined
}
