package in.codingage.samarpan.repository;

import in.codingage.samarpan.model.Batch;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BatchRepository extends MongoRepository<Batch,String> {

    Batch findByBatchName(String batchName);

    List<Batch> findAllByBranchId(String branchId);
}
