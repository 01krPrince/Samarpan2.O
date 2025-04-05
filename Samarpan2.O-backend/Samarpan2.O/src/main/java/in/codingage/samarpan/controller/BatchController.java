package in.codingage.samarpan.controller;

import in.codingage.samarpan.model.Batch;
import in.codingage.samarpan.model.Branch;
import in.codingage.samarpan.service.BatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/Batch")
@PreAuthorize("hasRole('ADMIN')")
public class BatchController {

    @Autowired
    private BatchService batchService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/createBatch")
    public Batch createBatch(@RequestParam String batchName, @RequestBody Branch branch){
        return batchService.createBatch(batchName,branch);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/updateBatch")
    public void updateBatch(@RequestParam String batchName,@RequestParam String newBatchName){
        batchService.updateBatch(batchName,newBatchName);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/deleteBatch")
    public Batch deleteBatch(@RequestParam String batchName){
        return  batchService.deleteBatch(batchName);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/getAllBatch")
    public List<Batch> getAllBatch(){
        return batchService.getAllBatch();
    }

}
