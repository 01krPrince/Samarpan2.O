package com.example.Samarpan2.O.service;

import com.example.Samarpan2.O.model.Subject;

import java.util.List;

public interface SubjectService {

    Subject createSubject(String subjectName);

    void updateSubject(String subjectName, String newSubjectName);

    Subject deleteSubject(String subjectName);

    List<Subject> getAllSubjects();
}
