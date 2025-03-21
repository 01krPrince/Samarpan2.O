package com.example.Samarpan2.O.controller;

import com.example.Samarpan2.O.model.Subject;
import com.example.Samarpan2.O.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/subject")
public class SubjectController {
    @Autowired
    private SubjectService subjectService;

    @PostMapping("/createsubject")
    public Subject createSubject(@RequestParam String subjectName){
        return subjectService.createSubject(subjectName);
    }

    @PutMapping("/updatesubject")
    public void updateSubject(@RequestParam String subjectName,@RequestParam String newSubjectName){
         subjectService.updateSubject(subjectName,newSubjectName);
    }

    @DeleteMapping("/deletesubject")
    public Subject deleteSubject(@RequestParam String subjectName){
        return subjectService.deleteSubject(subjectName);
    }

    @GetMapping("/getAllSubjects")
    public List<Subject> getAllSubjects(){
        return subjectService.getAllSubjects();
    }



}
