package com.example.Samarpan2.O.service.impl;

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
        Batch batch = new Batch();
        batch.setBatchName(batchName);
        return batchRepository.save(batch);
    }

    @Override
    public void updateBatch(String batchName, String newBatchName) {
        Batch batch = batchRepository.findByBatchName(batchName);
        if (batch != null) {
            batch.setBatchName(newBatchName);
            batchRepository.save(batch);
        } else {
            throw new RuntimeException("Batch with name " + batchName + " not found.");
        }
    }

    @Override
    public Batch deleteBatch(String batchName) {
        Batch batch=batchRepository.findByBatchName(batchName);
        if (batch != null) {
            batchRepository.delete(batch);
            return batch;
        } else {
            throw new RuntimeException("Batch with name " + batchName + " not found.");
        }
    }

    @Override
    public List<Batch> getAllBatch() {
        return batchRepository.findAll();
    }
}
