package com.backend.exception;

@SuppressWarnings("serial")
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}

