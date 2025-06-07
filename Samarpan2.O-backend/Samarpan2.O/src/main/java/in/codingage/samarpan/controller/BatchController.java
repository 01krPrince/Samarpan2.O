package in.codingage.samarpan.controller;

import in.codingage.samarpan.model.Batch;
import in.codingage.samarpan.model.Branch;
import in.codingage.samarpan.service.BatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/Batch")
public class BatchController {

    @Autowired
    private BatchService batchService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/createBatch")
    public Batch createBatch(@RequestParam String batchName, @RequestParam String branchId){
        System.out.println(batchName+branchId);
        return batchService.createBatch(batchName,branchId);
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

    @GetMapping("/getAllBatch")
    public ResponseEntity<List<Batch>> getAllBatch(){
        return batchService.getAllBatch();
    }

    @GetMapping("/findAllByBranchId")

    public List<Batch> findAllByBranchId(@RequestParam String branchId){
        return batchService.findAllByBranchId(branchId);
    }
}
