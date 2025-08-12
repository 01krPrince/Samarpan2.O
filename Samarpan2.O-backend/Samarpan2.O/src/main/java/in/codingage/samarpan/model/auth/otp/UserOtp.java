package in.codingage.samarpan.model.auth.otp;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "user_otps")
public class UserOtp {

    @Id
    private String id;

    private String userId;

    private String otp;

    private boolean used;

    private LocalDateTime createdAt;
}
