package in.codingage.samarpan.service.impl;

import in.codingage.samarpan.exception.ResourceNotFoundException;
import in.codingage.samarpan.model.Batch;
import in.codingage.samarpan.repository.BatchRepository;
import in.codingage.samarpan.service.BatchService;
import in.codingage.samarpan.service.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Optional;

@Service
public class BatchServiceImpl implements BatchService {
    @Autowired
    private BatchRepository batchRepository;
    private BranchService branchService;

    @Autowired
    public BatchServiceImpl(BatchRepository batchRepository, BranchService branchService) {
        this.batchRepository = batchRepository;
        this.branchService = branchService;
    }

    @Override
    public Batch createBatch(String batchName, String branchId) {
        if (batchName == null || batchName.trim().isEmpty()) {
            throw new IllegalArgumentException("Batch name cannot be null or empty.");
        }

        if (branchService.findById(branchId).isEmpty()) {
            throw new IllegalArgumentException("Branch name cannot be invalid, null or empty.");
        }

        if (batchRepository.findByBatchName(batchName) != null) {
            throw new IllegalArgumentException("Batch with name '" + batchName + "' already exists.");
        }

        Batch batch = new Batch();
        batch.setBatchName(batchName);
        batch.setBranchId(branchId);
        return batchRepository.save(batch);
    }

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

    @Override
    public ResponseEntity<List<Batch>> getAllBatch() {
        System.out.println("Hello");
        List<Batch> batches = batchRepository.findAll();
        return ResponseEntity.ok(batches);
    }

    @Override
    public List<Batch> findAllByBranchId(@RequestParam String branchId){
        return batchRepository.findAllByBranchId(branchId);
    }

    public Optional<Batch> findById(String batchId) {
        return batchRepository.findById(batchId);
    }
}
