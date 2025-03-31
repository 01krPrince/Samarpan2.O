package in.codingage.samarpan.service;

import in.codingage.samarpan.model.Subject;

import java.util.List;

public interface SubjectService {

    Subject createSubject(String subjectName);

    void updateSubject(String subjectName, String newSubjectName);

    Subject deleteSubject(String subjectName);

    List<Subject> getAllSubjects();
}
