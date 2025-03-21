package com.example.Samarpan2.O.service.impl;

import com.example.Samarpan2.O.model.Batch;
import com.example.Samarpan2.O.model.User;
import com.example.Samarpan2.O.model.createRequest.UserResponse;
import com.example.Samarpan2.O.repository.UserRepository;
import com.example.Samarpan2.O.service.BranchService;
import com.example.Samarpan2.O.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BranchService branchService;

    public UserServiceImpl(UserRepository userRepository, BranchService branchService) {
        this.userRepository = userRepository;
        this.branchService = branchService;
    }

    public User registerUser(UserResponse userResponse) {
        User user = userRepository.findByEmail(userResponse.getEmail());
        if (user != null) {
            return new User();
        }
        User newUser = new User();
        newUser.setName(userResponse.getName());
        newUser.setEmail(userResponse.getEmail());
        newUser.setPassword(userResponse.getPassword());
        newUser.setPhone(userResponse.getPhone());

        return userRepository.save(newUser);
    }

    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user.getPassword().equals(email)) {
            return user;
        }
        return null;
    }

    public User updateUser(UserResponse userResponse) {
        User user = userRepository.findByEmail(userResponse.getEmail());
        if (user != null) {
            throw new RuntimeException("User not found");
        }
        if (user.getPassword().equals(userResponse.getPassword())) {
            throw new RuntimeException("Username & Password not correct");
        }
        User newUser = new User();
        newUser.setName(userResponse.getName());
        newUser.setEmail(userResponse.getEmail());
        newUser.setPassword(userResponse.getPassword());
        newUser.setPhone(userResponse.getPhone());
        return newUser;
    }

    @Override
    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(String userId) {
        return userRepository.findById(userId);
    }

    @Override
    public List<User> getAllUserByBatch(String batchId) {
        return userRepository.findAllByBatch(batchId);
    }

}