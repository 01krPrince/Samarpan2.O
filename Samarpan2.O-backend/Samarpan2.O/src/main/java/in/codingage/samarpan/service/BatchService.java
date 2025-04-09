package in.codingage.samarpan.service;

import in.codingage.samarpan.model.Batch;
import in.codingage.samarpan.model.Branch;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface BatchService {

    Batch createBatch(String batchName, String branchId);

    void updateBatch(String batchName, String newBatchName);

    Batch deleteBatch(String batchName);


    ResponseEntity<List<Batch>> getAllBatch();

    List<Batch> findAllByBranchId(String branchId);
}
