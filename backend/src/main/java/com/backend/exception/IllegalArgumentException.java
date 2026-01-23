package com.backend.exception;


@SuppressWarnings("serial")
public class IllegalArgumentException extends RuntimeException {
    public IllegalArgumentException(String message) {
        super(message);
    }
}
