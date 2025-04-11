package in.codingage.samarpan.controller;// File: KeepAliveController.java

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class KeepAliveController {

    @GetMapping("/ping")
    public String ping() {
        return "Backend is alive!";
    }
}
