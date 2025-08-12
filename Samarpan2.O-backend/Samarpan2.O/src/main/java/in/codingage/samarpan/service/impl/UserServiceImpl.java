package in.codingage.samarpan.service.impl;//package com.example.Samarpan2.O.service.impl;

import in.codingage.samarpan.exception.ResourceNotFoundException;
import in.codingage.samarpan.model.User;
import in.codingage.samarpan.model.createRequest.UserResponse;
import in.codingage.samarpan.repository.UserRepository;
import in.codingage.samarpan.service.UserService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User updateUser(UserResponse userResponse) {
        if (userResponse == null) {
            throw new IllegalArgumentException("User response cannot be null");
        }

        User user = userRepository.findByEmail(userResponse.getEmail());
        if (user == null) {
            throw new ResourceNotFoundException("User not found with email: " + userResponse.getEmail());
        }

        if (!user.getPassword().equals(userResponse.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        user.setName(userResponse.getName());
        user.setPhone(userResponse.getPhone());
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUser() {
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No users found");
        }
        return users;
    }

    @Override
    public Optional<User> getUserById(String userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }
        return user;
    }

    @Override
    public List<User> getAllUserByBatch(String batchId) {
        if (batchId == null) {
            throw new IllegalArgumentException("Batch ID cannot be null");
        }
        List<User> users = userRepository.findAllByBatch(batchId);
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No users found for batch: " + batchId);
        }
        return users;
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public boolean verification(String email) {
        User user = getUserByEmail(email);
        user.setVerified(true);
        userRepository.save(user);
        return true;
    }

    public Optional<User> findById(String studentId) {
        return userRepository.findById(studentId);
    }

    public Optional<User> findByUsername(String remoteUser) {
        return userRepository.findByUsername(remoteUser);
    }
}