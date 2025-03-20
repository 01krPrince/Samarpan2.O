package com.example.Samarpan2.O.model;

import org.springframework.data.annotation.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user")
public class User {
    @Id
    private String id;

    private String email;
    private String password;
    private String name;
    private String phone;
    private String batch;
    private Role role;  // STUDENT or ADMIN
    public enum Role {
        STUDENT, ADMIN
    }
}
