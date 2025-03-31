package in.codingage.samarpan.service;

import in.codingage.samarpan.model.User;
import in.codingage.samarpan.model.createRequest.UserResponse;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User registerUser(UserResponse userResponse);

    User loginUser(String email, String password);

    User updateUser(UserResponse userResponse);

    List<User> getAllUser();

    Optional<User> getUserById(String userId);

    List<User> getAllUserByBatch(String batchId);
}
