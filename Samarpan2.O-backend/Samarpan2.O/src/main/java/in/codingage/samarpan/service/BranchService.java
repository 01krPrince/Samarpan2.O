package in.codingage.samarpan.service;

import in.codingage.samarpan.model.Branch;

import java.util.List;
import java.util.Optional;

public interface BranchService {
    Branch createBranch(String branchName);

    List<Branch> getAllBranches();

    Optional<Branch> findById(String branchId);
}
