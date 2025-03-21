package com.example.Samarpan2.O.service;

import com.example.Samarpan2.O.model.Batch;

import java.util.List;

public interface BatchService {

    Batch createBatch(String batchName);

    void updateBatch(String batchName, String newBatchName);

    Batch deleteBatch(String batchName);


    List<Batch> getAllBatch();
}
