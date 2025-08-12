package in.codingage.samarpan.repository;

import in.codingage.samarpan.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    User findByEmail(String email);

    List<User> findAllByBatch(String batchId);

    Optional<User> findByUsername(String userNameFromJwtToken);

    boolean existsByUsername(String contact);

    boolean existsByEmail(String email);

    Optional<User> findByPhone(String phone);
}
