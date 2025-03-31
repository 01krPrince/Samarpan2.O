package in.codingage.samarpan.repository;

import in.codingage.samarpan.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {

    User findByEmail(String email);

    List<User> findAllByBatch(String batchId);
}
