package com.example.Samarpan2.O.repository;

import com.example.Samarpan2.O.model.Branch;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BranchRepository extends MongoRepository<Branch, String> {

    Branch findByBranchName(String upperCase);
}
