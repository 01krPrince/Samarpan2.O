package in.codingage.samarpan.service.impl;

import in.codingage.samarpan.exception.ResourceNotFoundException;
import in.codingage.samarpan.model.Subject;
import in.codingage.samarpan.repository.SubjectRepository;
import in.codingage.samarpan.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubjectServiceImpl implements SubjectService {
    @Autowired
    private SubjectRepository subjectRepository;

    @Override
    public Subject createSubject(String subjectName) {
        System.out.println(subjectName);
        if (subjectRepository.findBySubjectName(subjectName) != null) {
            throw new IllegalArgumentException("Subject with name " + subjectName + " already exists.");
        }
        Subject subject = new Subject();
        subject.setSubjectName(subjectName);
        return subjectRepository.save(subject);
    }

    @Override
    public void updateSubject(String subjectName, String newSubjectName) {
        Subject subject = subjectRepository.findBySubjectName(subjectName);
        if (subject == null) {
            throw new ResourceNotFoundException("Subject with name " + subjectName + " not found.");
        }
        if (subjectRepository.findBySubjectName(newSubjectName) != null) {
            throw new IllegalArgumentException("Subject with name " + newSubjectName + " already exists.");
        }
        subject.setSubjectName(newSubjectName);
        subjectRepository.save(subject);
    }

    @Override
    public Subject deleteSubject(String subjectName) {
        Subject subject = subjectRepository.findBySubjectName(subjectName);
        if (subject == null) {
            throw new ResourceNotFoundException("Subject with name " + subjectName + " not found.");
        }
        subjectRepository.delete(subject);
        return subject;
    }


    @Override
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public Optional<Object> findById(String subjectId) {
        return Optional.of(subjectRepository.findById(subjectId));
    }
}
