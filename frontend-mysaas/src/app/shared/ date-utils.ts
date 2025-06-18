import { AbstractControl, ValidationErrors } from '@angular/forms';

// Função utilitária para formatar datas no formato PostgreSQL
export function formatDateToPostgres(date: Date): string {
    return date
        .toLocaleString('sv-SE', { hour12: false })
        .replace('T', ' ');
}



export function dateTimeValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    // Regex para validar o formato DD/MM/YYYY HH:mm:ss
    const dateRegex = /^([0-2]\d|3[0-1])\/(0\d|1[0-2])\/\d{4} ([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
    if (value && !dateRegex.test(value)) {
        return { invalid: true };
    }

    return null;
}

export function dateValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    // Regex para validar o formato DD/MM/YYYY HH:mm:ss
    const dateRegex = /^([0-2]\d|3[0-1])\/(0\d|1[0-2])\/\d{4}$/;
    if (value && !dateRegex.test(value)) {
        return { invalid: true };
    }

    return null;
}