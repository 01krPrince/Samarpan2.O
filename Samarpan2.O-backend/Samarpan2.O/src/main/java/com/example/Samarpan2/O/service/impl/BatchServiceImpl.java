package com.example.Samarpan2.O.service.impl;

import com.example.Samarpan2.O.exception.ResourceNotFoundException;
import com.example.Samarpan2.O.model.Batch;
import com.example.Samarpan2.O.repository.BatchRepository;
import com.example.Samarpan2.O.service.BatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BatchServiceImpl implements BatchService {
    @Autowired
    private BatchRepository batchRepository;

    @Override
    public Batch createBatch(String batchName) {
        if (batchName == null || batchName.trim().isEmpty()) {
            throw new IllegalArgumentException("Batch name cannot be null or empty.");
        }

        if (batchRepository.findByBatchName(batchName) != null) {
            throw new IllegalArgumentException("Batch with name '" + batchName + "' already exists.");
        }

        Batch batch = new Batch();
        batch.setBatchName(batchName);
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
    public List<Batch> getAllBatch() {
        return batchRepository.findAll();
    }
}
