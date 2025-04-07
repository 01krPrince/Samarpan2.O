package in.codingage.samarpan.model.auth;

import in.codingage.samarpan.model.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author deor
 */
@Getter
@Setter
@NoArgsConstructor
public class LoginResponse {
  private String token;
  private String type = "Bearer";
  private User user;
  private boolean newUser;
  private boolean childUser;

  public LoginResponse(String token, User user, boolean newUser) {
    this.token = token;
    this.user = user;
    this.newUser = newUser;
  }

}
