package com.example.Samarpan2.O.service.impl;

import com.example.Samarpan2.O.model.Branch;
import com.example.Samarpan2.O.repository.BranchRepository;
import com.example.Samarpan2.O.service.BranchService;
import com.example.Samarpan2.O.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BranchServiceImpl implements BranchService {

    private final BranchRepository branchRepository;

    public BranchServiceImpl (BranchRepository branchRepository) {
        this.branchRepository = branchRepository;
    }

    @Override
    public Branch createBranch(String branchName) {
        if (branchName == null || branchName.trim().isEmpty()) {
            throw new IllegalArgumentException("Branch name cannot be null or empty");
        }

        Branch existingBranch = branchRepository.findByBranchName(branchName);
        
        if (existingBranch != null) {
            throw new IllegalArgumentException("Branch with name " + branchName + " already exists");
        }

        Branch newBranch = new Branch();
        newBranch.setBranchName(branchName);
        return branchRepository.save(newBranch);
    }

    @Override
    public List<Branch> getAllBranches() {
        List<Branch> branches = branchRepository.findAll();
        if (branches.isEmpty()) {
            throw new ResourceNotFoundException("No branches found");
        }
        return branches;
    }

    @Override
    public Optional<Branch> findById(String branchId) {
        if (branchId == null) {
            throw new IllegalArgumentException("Branch ID cannot be null");
        }
        
        Optional<Branch> branch = branchRepository.findById(branchId);
        if (branch.isEmpty()) {
            throw new ResourceNotFoundException("Branch not found with ID: " + branchId);
        }
        return branch;
    }
}
