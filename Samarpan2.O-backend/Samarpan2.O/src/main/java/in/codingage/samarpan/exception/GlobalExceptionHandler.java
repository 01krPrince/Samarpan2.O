//package in.codingage.samarpan.exception;
//
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.ControllerAdvice;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@ControllerAdvice
//public class GlobalExceptionHandler {
//
//    @ExceptionHandler(ApplicationException.class)
//    public ResponseEntity<Map<String, Object>> handleApplicationException(ApplicationException ex) {
//        Map<String, Object> response = new HashMap<>();
//        response.put("error", "ApplicationException");
//        response.put("message", ex.getMessage());
//        response.put("errors", ex.getErrors()); // your custom key-errorCode map
//        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
//    }
//
//    @ExceptionHandler(ResourceNotFoundException.class)
//    public ResponseEntity<Map<String, Object>> handleResourceNotFound(ResourceNotFoundException ex) {
//        Map<String, Object> response = new HashMap<>();
//        response.put("error", "ResourceNotFound");
//        response.put("message", ex.getMessage());
//        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
//    }
//
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<Map<String, Object>> handleGeneral(Exception ex) {
//        Map<String, Object> response = new HashMap<>();
//        response.put("error", "InternalServerError");
//        response.put("message", ex.getMessage());
//        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
//    }
//}
