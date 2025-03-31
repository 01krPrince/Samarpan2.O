package in.codingage.samarpan.repository;

import in.codingage.samarpan.model.Branch;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BranchRepository extends MongoRepository<Branch, String> {

    Branch findByBranchName(String upperCase);
}
