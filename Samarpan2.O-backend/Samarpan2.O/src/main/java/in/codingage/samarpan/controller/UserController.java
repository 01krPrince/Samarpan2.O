package in.codingage.samarpan.controller;

import in.codingage.samarpan.model.User;
import in.codingage.samarpan.model.createRequest.UserResponse;
import in.codingage.samarpan.service.UserService;
import in.codingage.samarpan.service.impl.UserServiceImpl;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService userService;

    public UserController(UserServiceImpl userService) {
        this.userService = userService;
    }

    @PutMapping("updateUser")
    public User updateUser(@RequestBody UserResponse userResponse) {
        return userService.updateUser(userResponse);
    }

    @GetMapping("getAllUser")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUser() {
        return userService.getAllUser();
    }

    @GetMapping("/userId")
    public Optional<User> getUserById(@RequestParam String userId) {
        return userService.getUserById(userId);
    }

    @GetMapping("userByBatch")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUserByBatch(@RequestParam String batchId) {
        return userService.getAllUserByBatch(batchId);
    }

}
