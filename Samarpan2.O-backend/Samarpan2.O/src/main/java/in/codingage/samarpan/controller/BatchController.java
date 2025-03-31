package in.codingage.samarpan.controller;

import in.codingage.samarpan.model.Batch;
import in.codingage.samarpan.service.BatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/Batch")
public class BatchController {

    @Autowired
    private BatchService batchService;

    @PostMapping("/createBatch")
    public Batch createBatch(@RequestParam String batchName){
        return batchService.createBatch(batchName);
    }

    @PutMapping("/updateBatch")
    public void updateBatch(@RequestParam String batchName,@RequestParam String newBatchName){
        batchService.updateBatch(batchName,newBatchName);
    }

    @DeleteMapping("/deleteBatch")
    public Batch deleteBatch(@RequestParam String batchName){
        return  batchService.deleteBatch(batchName);
    }

    @GetMapping("/getAllBatch")
    public List<Batch> getAllBatch(){
        return batchService.getAllBatch();
    }

}
