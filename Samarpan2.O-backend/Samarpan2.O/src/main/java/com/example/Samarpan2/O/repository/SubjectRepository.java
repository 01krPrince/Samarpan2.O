package com.example.Samarpan2.O.repository;

import com.example.Samarpan2.O.model.Subject;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SubjectRepository extends MongoRepository<Subject,String> {
    Subject findBySubjectName(String subjectName);
}
