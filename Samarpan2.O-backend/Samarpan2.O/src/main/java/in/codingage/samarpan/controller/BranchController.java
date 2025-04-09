package in.codingage.samarpan.controller;

import in.codingage.samarpan.model.Branch;
import in.codingage.samarpan.service.BranchService;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("createBranch")
    public Branch createBranch(@RequestParam String branchName) {
        return branchService.createBranch(branchName);
    }

//    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("getAllBranches")
    public List<Branch> getAllBranches() {
        return branchService.getAllBranches();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("branchById")
    public Optional<Branch> findById(@RequestParam String branchId) {
        return branchService.findById(branchId);
    }


}
