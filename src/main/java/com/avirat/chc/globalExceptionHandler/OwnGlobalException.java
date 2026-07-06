package com.avirat.chc.globalExceptionHandler;

import com.avirat.chc.globalException.DataNotFoundException;
import com.avirat.chc.helper.CustomMessages;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class OwnGlobalException {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<CustomMessages>runTimeExceptionHandler(RuntimeException e) {
        String msg=e.getMessage();
       CustomMessages messages= CustomMessages.builder().msg(msg).build();
        return new ResponseEntity<>(messages, HttpStatus.NOT_FOUND);

    }
    @ExceptionHandler(DataNotFoundException.class)
    public ResponseEntity<CustomMessages>dataNotFoundExceptionHandler(DataNotFoundException dataNotFoundException){
        String msg=dataNotFoundException.getMessage();
        CustomMessages messages= CustomMessages.builder().msg(msg).build();
        return new ResponseEntity<>(messages, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<String>>methodArgumentNotValidException(MethodArgumentNotValidException methodArgumentNotValidException){
        BindingResult bindingResult=methodArgumentNotValidException.getBindingResult();
        List<ObjectError>objectErrorList=bindingResult.getAllErrors();
        
        List<String>listDefaultMessage=objectErrorList.stream().map(objectError -> objectError.getDefaultMessage()).toList();
        return new ResponseEntity<>(listDefaultMessage, HttpStatus.NOT_ACCEPTABLE);
    }
}
