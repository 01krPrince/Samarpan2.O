package com.example.Samarpan2.O.repository;

import com.example.Samarpan2.O.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {

    User findByEmail(String email);
}
