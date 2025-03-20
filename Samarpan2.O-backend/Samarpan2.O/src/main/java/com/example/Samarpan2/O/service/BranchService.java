package com.example.Samarpan2.O.service;

import com.example.Samarpan2.O.model.Branch;

import java.util.List;
import java.util.Optional;

public interface BranchService {
    Branch createBranch(String branchName);

    List<Branch> getAllBranches();

    Optional<Branch> findById(String branchId);
}
