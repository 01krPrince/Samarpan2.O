package in.codingage.samarpan.service.impl;

import in.codingage.samarpan.exception.ResourceNotFoundException;
import in.codingage.samarpan.model.Batch;
import in.codingage.samarpan.model.Branch;
import in.codingage.samarpan.repository.BatchRepository;
import in.codingage.samarpan.service.BatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BatchServiceImpl implements BatchService {
    @Autowired
    private BatchRepository batchRepository;
    private BranchServiceImpl branchService;

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public Batch createBatch(String batchName, Branch branch) {
        if (batchName == null || batchName.trim().isEmpty()) {
            throw new IllegalArgumentException("Batch name cannot be null or empty.");
        }

        if (!branchService.findById(branch.getId()).isPresent()) {
            throw new IllegalArgumentException("Branch name cannot be invalid, null or empty.");
        }

        if (batchRepository.findByBatchName(batchName) != null) {
            throw new IllegalArgumentException("Batch with name '" + batchName + "' already exists.");
        }

        Batch batch = new Batch();
        batch.setBatchName(batchName);
        batch.setBranch(branch);
        return batchRepository.save(batch);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public void updateBatch(String batchName, String newBatchName) {
        if (batchName == null || batchName.trim().isEmpty() || newBatchName == null || newBatchName.trim().isEmpty()) {
            throw new IllegalArgumentException("Batch names cannot be null or empty.");
        }
        Batch batch = batchRepository.findByBatchName(batchName);
        if (batch == null) {
            throw new ResourceNotFoundException("Batch with name '" + batchName + "' not found.");
        }

        // Check if the new batch name already exists
        if (!batchName.equals(newBatchName) && batchRepository.findByBatchName(newBatchName) != null) {
            throw new IllegalArgumentException("Batch with name '" + newBatchName + "' already exists.");
        }

        batch.setBatchName(newBatchName);
        batchRepository.save(batch);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public Batch deleteBatch(String batchName) {
        if (batchName == null || batchName.trim().isEmpty()) {
            throw new IllegalArgumentException("Batch name cannot be null or empty.");
        }
        Batch batch = batchRepository.findByBatchName(batchName);
        if (batch == null) {
            throw new ResourceNotFoundException("Batch with name '" + batchName + "' not found.");
        }
        batchRepository.delete(batch);
        return batch;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Override
    public List<Batch> getAllBatch() {
        System.out.println("Hello");
        return batchRepository.findAll();
    }
}
