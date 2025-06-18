import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[appDateMask]',
})
export class DateMaskDirective {
    constructor(private el: ElementRef) { }

    @HostListener('input', ['$event']) onInput(): void {
        const inputElement = this.el.nativeElement;

        // Remove caracteres não numéricos
        let numericInput = inputElement.value.replace(/\D/g, '');

        // Limita o comprimento máximo
        numericInput = numericInput.slice(0, 14);

        // Aplica a máscara
        let maskedInput = '';
        if (numericInput.length > 0) {
            maskedInput = numericInput.slice(0, 2); // Dia
        }
        if (numericInput.length >= 3) {
            maskedInput += '/' + numericInput.slice(2, 4); // Mês
        }
        if (numericInput.length >= 5) {
            maskedInput += '/' + numericInput.slice(4, 8); // Ano
        }
        if (numericInput.length >= 9) {
            maskedInput += ' ' + numericInput.slice(8, 10); // Hora
        }
        if (numericInput.length >= 11) {
            maskedInput += ':' + numericInput.slice(10, 12); // Minuto
        }
        if (numericInput.length >= 13) {
            maskedInput += ':' + numericInput.slice(12, 14); // Segundo
        }

        // Atualiza o valor do campo
        inputElement.value = maskedInput;
    }

    @HostListener('blur') onBlur(): void {
        const inputElement = this.el.nativeElement;
        const value = inputElement.value;

        // Regex para validar o formato DD/MM/YYYY HH:mm:ss
        const dateRegex = /^([0-2]\d|3[0-1])\/(0\d|1[0-2])\/\d{4} ([0-1]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

        if (!dateRegex.test(value)) {
            // Exibe uma mensagem de erro (ajuste conforme necessário)
            console.error('Data ou hora inválida:', value);
            inputElement.setCustomValidity('Por favor, insira uma data e hora válidas no formato DD/MM/YYYY HH:mm:ss.');
        } else {
            // Limpa mensagens de erro se a entrada for válida
            inputElement.setCustomValidity('');
        }
    }
}
