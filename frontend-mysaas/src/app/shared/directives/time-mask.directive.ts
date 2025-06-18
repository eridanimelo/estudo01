import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appTimeMask]'
})
export class TimeMaskDirective {
    private regex: RegExp = new RegExp(/^[0-9:]*$/);
    private maxLength: number = 8; // HH:mm:ss

    constructor(private el: ElementRef) { }

    @HostListener('input', ['$event']) onInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/[^0-9]/g, ''); // Remove caracteres não numéricos

        if (value.length > 6) {
            value = value.substring(0, 6); // Limita a 6 dígitos (HHmmss)
        }

        // Aplica a máscara HH:mm:ss
        let formattedValue = '';
        if (value.length > 0) formattedValue += value.substring(0, 2);
        if (value.length > 2) formattedValue += ':' + value.substring(2, 4);
        if (value.length > 4) formattedValue += ':' + value.substring(4, 6);

        input.value = formattedValue;
    }

    @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
        if (
            event.key !== 'Backspace' &&
            event.key !== 'Delete' &&
            !this.regex.test(event.key) &&
            event.key !== 'Tab' &&
            event.key !== 'ArrowLeft' &&
            event.key !== 'ArrowRight'
        ) {
            event.preventDefault(); // Bloqueia caracteres inválidos
        }
    }
}
