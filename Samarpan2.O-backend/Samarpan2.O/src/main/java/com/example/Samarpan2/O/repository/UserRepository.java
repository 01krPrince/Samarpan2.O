package com.example.Samarpan2.O.repository;

import com.example.Samarpan2.O.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {

    User findByEmail(String email);

    List<User> findAllByBatch(String batchId);
}
