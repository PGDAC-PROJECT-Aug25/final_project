package com.backend.exception;

@SuppressWarnings("serial")
public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException(String message) {
        super(message);
    }
}
