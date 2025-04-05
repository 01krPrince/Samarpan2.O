package in.codingage.samarpan.controller;

import in.codingage.samarpan.model.Subject;
import in.codingage.samarpan.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/subject")
public class SubjectController {
    @Autowired
    private SubjectService subjectService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/createsubject")
    public Subject createSubject(@RequestParam String subjectName){
        System.out.println("Hello ");
        return subjectService.createSubject(subjectName);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/updatesubject")
    public void updateSubject(@RequestParam String subjectName,@RequestParam String newSubjectName){
         subjectService.updateSubject(subjectName,newSubjectName);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/deletesubject")
    public Subject deleteSubject(@RequestParam String subjectName){
        return subjectService.deleteSubject(subjectName);
    }

    @GetMapping("/getAllSubjects")
    public ResponseEntity<List<Subject>> getAllSubjects() {
        List<Subject> subjects = subjectService.getAllSubjects(); // ensure this doesn't throw
        return ResponseEntity.ok(subjects);
    }

}