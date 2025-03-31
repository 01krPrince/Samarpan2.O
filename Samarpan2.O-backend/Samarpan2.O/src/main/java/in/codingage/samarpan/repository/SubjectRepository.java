package in.codingage.samarpan.repository;

import in.codingage.samarpan.model.Subject;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SubjectRepository extends MongoRepository<Subject,String> {
    Subject findBySubjectName(String subjectName);
}
