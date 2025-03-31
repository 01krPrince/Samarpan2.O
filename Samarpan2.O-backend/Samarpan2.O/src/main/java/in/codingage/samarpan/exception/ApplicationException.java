package in.codingage.samarpan.exception;

import lombok.Getter;
import org.springframework.util.CollectionUtils;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
@Getter
public class ApplicationException extends RuntimeException {
    private HashMap<String, List<String>> errors;

    public ApplicationException(String key, String errorCode) {
        super(key + " " + errorCode);
        this.add(key, errorCode);
    }


    public void add(String key, String errorCode) {
        if (errors == null) {
            errors = new HashMap<>();
        }
        errors.put(key, Arrays.asList(errorCode));
    }


    public Boolean containsException() {
        return !CollectionUtils.isEmpty(errors);
    }

    public void throwIfHasError() {
        if (containsException())
            throw this;
    }
}
