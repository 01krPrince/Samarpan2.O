package in.codingage.samarpan.model;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Collections;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user")
public class User {
    @Id
    private String id;

    @Size(max = 20)
    private String username;

    private String email;
    private String password;
    private String instituteName;
    private String name;
    private String phone;
    private Batch batch;
    private Set<String> roles = Collections.singleton("STUDENT");
    private boolean activated;
    private boolean accountNonExpired;
    private boolean forceLogOut;
    private boolean isVerified;

    public User(String name, String email, String username, String password, String contact, boolean activated, boolean accountNonExpired) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
        this.phone = contact;
        this.instituteName = "codingage";
        this.activated = activated;
        this.accountNonExpired = accountNonExpired;
    }
}
