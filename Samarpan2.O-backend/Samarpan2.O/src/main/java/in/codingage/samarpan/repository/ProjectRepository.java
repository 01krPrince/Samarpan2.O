package in.codingage.samarpan.repository;

import in.codingage.samarpan.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {

     Optional<Project> findByProjectName(String projectName) ;


    List<Project> findAllByStudentId(String studentId);

    List<Project> findAllByBatchId(String batchId);
}
