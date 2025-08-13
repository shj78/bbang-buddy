package com.bbangbuddy.global.error;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * @PackageName : com.bbangbuddy.global.error
 * @FileName : GlobalExceptionHandler
 * @Author : hjsim
 * @Date : 2025-07-18
 * @Description :  <br>
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(500).body(ex.getMessage());
    }
}
