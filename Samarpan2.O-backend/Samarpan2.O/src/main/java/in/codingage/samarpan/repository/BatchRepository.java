package in.codingage.samarpan.repository;

import in.codingage.samarpan.model.Batch;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BatchRepository extends MongoRepository<Batch,String> {

    Batch findByBatchName(String batchName);
}
