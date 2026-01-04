package com.multiworkbackend.exceptions;

import com.multiworkbackend.dto.ErrorResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.util.WebUtils;
import org.hibernate.LazyInitializationException;

import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {
    public static final String TRACE = "trace";

    @Value("${multiwork.trace:false}")
    private boolean printStackTrace;
    
    /**
     * Creates a standardized error response.
     *
     * @param message error message
     * @param status HTTP status
     * @return ResponseEntity with ErrorResponse
     */
    private ResponseEntity<Object> createErrorResponse(String message, HttpStatus status) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .message(message)
                .build();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        return new ResponseEntity<>(errorResponse, headers, status);
    }
    
    /**
     * Handles exception with optional stack trace logging.
     *
     * @param ex exception
     * @param request web request
     */
    private void handleStackTrace(Exception ex, WebRequest request) {
        if (printStackTrace) {
            request.setAttribute(WebUtils.ERROR_EXCEPTION_ATTRIBUTE, ex, RequestAttributes.SCOPE_REQUEST);
        }
    }
    
    /**
     * Gets error message from exception, with fallback to default.
     *
     * @param ex exception
     * @param defaultMessage default message if exception message is empty
     * @return error message
     */
    private String getErrorMessage(Exception ex, String defaultMessage) {
        String message = ex.getMessage();
        if (message == null || message.trim().isEmpty()) {
            return defaultMessage;
        }
        return message;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            WebRequest request) {
        
        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .filter(msg -> msg != null && !msg.trim().isEmpty())
                .collect(Collectors.joining(", "));
        
        if (errorMessage == null || errorMessage.trim().isEmpty()) {
            errorMessage = "Validation failed";
        }
        
        return createErrorResponse(errorMessage, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({NoSuchElementFoundException.class})
    public ResponseEntity<Object> handleNoSuchElementFoundException(
            NoSuchElementFoundException ex,
            WebRequest request
    ){
        handleStackTrace(ex, request);
        String message = getErrorMessage(ex, "Resource not found");
        return createErrorResponse(message, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({AuthenticationException.class})
    public ResponseEntity<Object> handleAuthenticationException(
            AuthenticationException ex,
            WebRequest request
    ){
        handleStackTrace(ex, request);
        String message = getErrorMessage(ex, "Authentication failed");
        return createErrorResponse(message, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler({NoPermissionException.class})
    public ResponseEntity<Object> handleNoPermissionException(
            NoPermissionException ex,
            WebRequest request
    ){
        handleStackTrace(ex, request);
        String message = getErrorMessage(ex, "Access denied");
        return createErrorResponse(message, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler({AlreadyExistException.class})
    public ResponseEntity<Object> handleAlreadyExistException(
            AlreadyExistException ex,
            WebRequest request
    ){
        handleStackTrace(ex, request);
        String message = getErrorMessage(ex, "Resource already exists");
        return createErrorResponse(message, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({BadCredentialsException.class})
    public ResponseEntity<Object> handleBadCredentialsException(
            org.springframework.security.authentication.BadCredentialsException ex,
            WebRequest request
    ){
        handleStackTrace(ex, request);
        return createErrorResponse("Error: Invalid email or password!", HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler({UsernameNotFoundException.class})
    public ResponseEntity<Object> handleUsernameNotFoundException(
            UsernameNotFoundException ex,
            WebRequest request
    ){
        handleStackTrace(ex, request);
        String message = getErrorMessage(ex, "User not found");
        return createErrorResponse(message, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<Object> handleIllegalArgumentException(
            IllegalArgumentException ex,
            WebRequest request
    ){
        handleStackTrace(ex, request);
        String message = getErrorMessage(ex, "Invalid input");
        return createErrorResponse(message, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({HttpMessageNotWritableException.class})
    public ResponseEntity<Object> handleHttpMessageNotWritableException(
            HttpMessageNotWritableException ex,
            WebRequest request
    ){
        handleStackTrace(ex, request);
        
        String errorMessage = "Error serializing response data";
        Throwable cause = ex.getCause();
        if (cause instanceof LazyInitializationException) {
            errorMessage = "Failed to load lazy-initialized collection. Please ensure all required data is fetched within the transaction.";
        } else if (cause != null && cause.getMessage() != null) {
            String causeMessage = cause.getMessage();
            causeMessage = causeMessage.replace("\"", "'").replace("\n", " ").replace("\r", "");
            errorMessage = "Error serializing response: " + causeMessage;
        }
        
        return createErrorResponse(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
