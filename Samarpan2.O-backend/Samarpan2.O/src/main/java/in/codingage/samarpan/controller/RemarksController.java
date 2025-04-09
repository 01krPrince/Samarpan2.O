package in.codingage.samarpan.controller;

import in.codingage.samarpan.model.Remarks;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/remarks")
public class RemarksController {

    @GetMapping("/all")
    public ResponseEntity<Remarks[]> getAllRemarks() {
        return ResponseEntity.ok(Remarks.values());
    }
}
