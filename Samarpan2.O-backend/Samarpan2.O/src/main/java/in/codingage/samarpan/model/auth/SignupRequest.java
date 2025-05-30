package in.codingage.samarpan.model.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
    @NotBlank
    @Size(max = 50)
    private String instituteName;

    private String name;

    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    private String contact;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

}
