package com.eridanimelo.application.config.exception;

import org.springframework.http.HttpStatus;

public class AppException extends RuntimeException {

    private final HttpStatus httpStatus; // Campo para armazenar o status HTTP

    // Construtor com apenas a mensagem de erro
    public AppException(String message) {
        super(message);
        this.httpStatus = HttpStatus.INTERNAL_SERVER_ERROR; // Status default
    }

    // Construtor com mensagem de erro e causa
    public AppException(String message, Throwable cause) {
        super(message, cause);
        this.httpStatus = HttpStatus.INTERNAL_SERVER_ERROR; // Status default
    }

    // Construtor com mensagem de erro e um HttpStatus específico
    public AppException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }

    // Construtor com mensagem de erro, causa e um HttpStatus específico
    public AppException(String message, Throwable cause, HttpStatus httpStatus) {
        super(message, cause);
        this.httpStatus = httpStatus;
    }

    // Método para obter o HttpStatus associado à exceção
    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
