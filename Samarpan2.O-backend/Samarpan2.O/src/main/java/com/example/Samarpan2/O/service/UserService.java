package com.example.Samarpan2.O.service;

import com.example.Samarpan2.O.model.User;
import com.example.Samarpan2.O.model.createRequest.UserResponse;

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
