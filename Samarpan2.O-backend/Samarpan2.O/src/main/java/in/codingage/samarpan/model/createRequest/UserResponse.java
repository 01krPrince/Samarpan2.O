package in.codingage.samarpan.model.createRequest;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user")
public class UserResponse {
    private String email;
    private String password;
    private String name;
    private String phone;
    private String batch;
}
