package com.example.Samarpan2.O.service.Impl;

import com.example.Samarpan2.O.model.Branch;
import com.example.Samarpan2.O.repository.BranchRepository;
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
        Branch branch = branchRepository.findByBranchName(branchName.trim().toUpperCase());
        return null;
    }

    @Override
    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    @Override
    public Optional<Branch> findById(String branchId) {
        return branchRepository.findById(branchId);
    }
}
