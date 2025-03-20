package com.example.Samarpan2.O.controller;

import com.example.Samarpan2.O.model.Branch;
import com.example.Samarpan2.O.service.BranchService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/branch")
public class BranchController {
    private final BranchService branchService;

    BranchController(BranchService branchService) {
        this.branchService = branchService;
    }

    @PostMapping("createBranch")
    public Branch createBranch(@RequestParam String branchName) {
        return branchService.createBranch(branchName);
    }

    @GetMapping("getAllBranches")
    public List<Branch> getAllBranches() {
        return branchService.getAllBranches();
    }

    @GetMapping("branchById")
    public Optional<Branch> findById(@RequestParam String branchId) {
        return branchService.findById(branchId);
    }


}
