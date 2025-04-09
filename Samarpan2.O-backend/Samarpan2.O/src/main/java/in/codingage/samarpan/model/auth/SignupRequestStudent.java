package in.codingage.samarpan.model.auth;

import in.codingage.samarpan.model.Batch;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequestStudent {

    @Size(max = 50)
    @NotBlank
    private String name;

    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    private String contact;

    private Batch batch;
    
    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
    private String language = "EN";

}
