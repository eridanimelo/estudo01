package com.eridanimelo.application.config.exception;

import org.springframework.http.HttpStatus;

public class DataIntegrityException extends RuntimeException {

    private final HttpStatus status;

    public DataIntegrityException(String message) {
        super(message);
        this.status = HttpStatus.CONFLICT;
    }

    public DataIntegrityException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
