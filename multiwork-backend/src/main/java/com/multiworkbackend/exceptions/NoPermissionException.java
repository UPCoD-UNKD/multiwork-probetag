package com.multiworkbackend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class NoPermissionException extends ResponseStatusException {
    public NoPermissionException(String message) {
        super(HttpStatus.FORBIDDEN, message);
    }
}
