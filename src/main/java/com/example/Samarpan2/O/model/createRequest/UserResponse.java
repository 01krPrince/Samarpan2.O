package com.example.Samarpan2.O.model.createRequest;

import com.example.Samarpan2.O.model.User;
import org.springframework.data.annotation.Id;
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
