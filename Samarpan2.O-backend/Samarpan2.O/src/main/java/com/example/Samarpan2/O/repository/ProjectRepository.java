package com.example.Samarpan2.O.repository;

import com.example.Samarpan2.O.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectRepository extends MongoRepository<Project, String> {

     Optional<Project> findByProjectName(String projectName) ;


}
