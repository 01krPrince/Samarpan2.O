package in.codingage.samarpan.service;

import in.codingage.samarpan.model.Batch;
import in.codingage.samarpan.model.Branch;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface BatchService {

    Batch createBatch(String batchName, Branch branch);

    void updateBatch(String batchName, String newBatchName);

    Batch deleteBatch(String batchName);


    List<Batch> getAllBatch();
}
