package com.example.Samarpan2.O.repository;

import com.example.Samarpan2.O.model.Batch;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BatchRepository extends MongoRepository<Batch,String> {

    Batch findByBatchName(String batchName);
}
