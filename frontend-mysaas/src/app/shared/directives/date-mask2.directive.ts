import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
    selector: '[appDateMask2]',
})
export class DateMask2Directive {
    constructor(private el: ElementRef) { }

    @HostListener('input', ['$event']) onInput(): void {
        const inputElement = this.el.nativeElement;

        // Remove caracteres não numéricos
        let numericInput = inputElement.value.replace(/\D/g, '');

        // Limita o comprimento máximo
        numericInput = numericInput.slice(0, 8);

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

        // Atualiza o valor do campo
        inputElement.value = maskedInput;
    }

    @HostListener('blur') onBlur(): void {
        const inputElement = this.el.nativeElement;
        const value = inputElement.value;

        // Regex para validar o formato DD/MM/YYYY
        const dateRegex = /^([0-2]\d|3[0-1])\/(0\d|1[0-2])\/\d{4}$/;

        if (!dateRegex.test(value)) {
            // Exibe uma mensagem de erro (ajuste conforme necessário)
            console.error('Data inválida:', value);
            inputElement.setCustomValidity('Por favor, insira uma data válida no formato DD/MM/YYYY.');
        } else {
            // Limpa mensagens de erro se a entrada for válida
            inputElement.setCustomValidity('');
        }
    }
}
