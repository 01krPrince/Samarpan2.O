package in.codingage.samarpan.controller;

import in.codingage.samarpan.model.User;
import in.codingage.samarpan.model.createRequest.UserResponse;
import in.codingage.samarpan.service.UserService;
import in.codingage.samarpan.service.impl.UserServiceImpl;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("register")
    public User registerUser(@RequestBody UserResponse userResponse) {
        return userService.registerUser(userResponse);
    }

    @PostMapping("login")
    public User loginUser(@RequestParam String email, @RequestParam String password) {
        return userService.loginUser(email, password);
    }

    @PutMapping("updateUser")
    public User updateUser(@RequestBody UserResponse userResponse) {
        return userService.updateUser(userResponse);
    }

    @GetMapping("getAllUser")
    public List<User> getAllUser(@RequestParam String userName) {
        return userService.getAllUser();
    }

    @GetMapping("/userId")
    public Optional<User> getUserById(@RequestParam String userId) {
        return userService.getUserById(userId);
    }

    @GetMapping("userByBatch")
    public List<User> getAllUserByBatch(@RequestParam String batchId) {
        return userService.getAllUserByBatch(batchId);
    }

}
