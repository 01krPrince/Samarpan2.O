package in.codingage.samarpan.service;

import in.codingage.samarpan.model.User;
import in.codingage.samarpan.model.createRequest.UserResponse;

import java.util.List;
import java.util.Optional;

public interface UserService {

    User updateUser(UserResponse userResponse);

    List<User> getAllUser();

    Optional<User> getUserById(String userId);

    List<User> getAllUserByBatch(String batchId);

    User getUserByEmail(String email);
    boolean verification(String email);
}
