package com.example.Samarpan2.O.service.impl;

import com.example.Samarpan2.O.model.Subject;
import com.example.Samarpan2.O.repository.SubjectRepository;
import com.example.Samarpan2.O.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectServiceImpl implements SubjectService {
    @Autowired
    private SubjectRepository subjectRepository;

    @Override
    public Subject createSubject(String subjectName) {
        Subject subject=new Subject();
        subject.setSubjectName(subjectName);
        return subjectRepository.save(subject);
    }

    @Override
    public void updateSubject(String subjectName, String newSubjectName) {
        Subject subject=subjectRepository.findBySubjectName(subjectName);
        if (subject!=null){
            subject.setSubjectName(newSubjectName);
            subjectRepository.save(subject);
        } else {
        throw new RuntimeException("Subject with name " + subjectName + " not found.");
    }
    }

    @Override
    public Subject deleteSubject(String subjectName) {
        Subject subject=subjectRepository.findBySubjectName(subjectName);
        if (subject!=null){
            subjectRepository.delete(subject);
            return subject;
        } else {
        throw new RuntimeException("Subject with name " + subjectName + " not found.");
    }
    }

    @Override
    public List<Subject> getAllSubjects() {
       return subjectRepository.findAll();
    }
}
