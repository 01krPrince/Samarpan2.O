package in.codingage.samarpan.controller;

import in.codingage.samarpan.exception.ApplicationException;
import in.codingage.samarpan.model.User;
import in.codingage.samarpan.model.auth.*;
import in.codingage.samarpan.repository.BatchRepository;
import in.codingage.samarpan.repository.UserRepository;
import in.codingage.samarpan.security.jwt.JwtUtils;
import in.codingage.samarpan.security.services.impl.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    BatchRepository batchRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<LoginResponse> authenticateUser(
            @Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication =
                authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
                .collect(Collectors.toList());
        User user = userRepository.findByUsername(userDetails.getUsername()).orElseThrow(() -> new ApplicationException("USER", "DOES_NOT_EXIST"));
        System.out.println();
        LoginResponse loginResponse = new LoginResponse(jwt, user, false);
        System.out.println("User ID : " + user.getId());
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/signup/student")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequestStudent signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getContact())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: This contact number is is already registered!"));
        }

        if (null != signUpRequest.getEmail() && userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        if (signUpRequest.getBatch() == null || signUpRequest.getBatch().getBatchName() == null) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid or missing batch information!"));
        }

        User user = new User(signUpRequest.getName(), signUpRequest.getEmail(), signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()), signUpRequest.getContact(), false, false);

        Set<String> roles = new HashSet<>();
        roles.add("STUDENT");
        user.setRoles(roles);
        user.setBatch(signUpRequest.getBatch());
        User savedUser = userRepository.save(user);

        savedUser.setAccountNonExpired(true);
        savedUser.setActivated(true);

        userRepository.save(savedUser);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/signup/admin")
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getContact())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: This contact number is is already registered!"));
        }

        if (null != signUpRequest.getEmail() && userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User(signUpRequest.getName(), signUpRequest.getEmail(), signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()), signUpRequest.getContact(), false, false);


        Set<String> roles = new HashSet<>();
        roles.add("ADMIN");
        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        savedUser.setAccountNonExpired(true);
        savedUser.setActivated(true);

        userRepository.save(savedUser);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/reset-password/admin")
    public ResponseEntity<?> resetAdminPassword(@RequestParam String username, @RequestParam String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApplicationException("USER", "DOES_NOT_EXIST"));

        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Password has been reset to : " + newPassword));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String email, @RequestParam String phoneNumber, @RequestParam String newPassword) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("User with this email does not exist."));
        }

        if (!user.getPhone().equals(phoneNumber)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Phone number does not match our records."));
        }

        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Password has been reset successfully."));
    }

    @PutMapping("/update-email")
    public ResponseEntity<String> updateEmail(@RequestParam String email, @RequestParam String newEmail) {
        // Validate input
        if (email == null || email.isEmpty() || newEmail == null || newEmail.isEmpty()) {
            return ResponseEntity.badRequest().body("Email and new email must not be empty.");
        }

        // Find the user by current email
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with the provided email not found.");
        }

        // Check if newEmail is already taken
        if (userRepository.findByEmail(newEmail) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("The new email is already in use.");
        }

        // Update the email and username
        user.setEmail(newEmail);
        user.setUsername(newEmail); // if username must match email
        userRepository.save(user); // Don't forget to save the updated user

        return ResponseEntity.ok("Email updated successfully.");
    }

    @RestController
    @RequestMapping("/api/users")
    public class UserController {

        @Autowired
        private UserRepository userRepository;

        @DeleteMapping("/delete-specific")
        public ResponseEntity<String> deleteSpecificUsers() {
            List<String> emailsToDelete = Arrays.asList(
                    "princekr3006@gmail.com",
                    "admin@gmail.com",
                    "student@gmail.com",
                    "testing@gmail.com",
                    "a@b.c",
                    "web@dev.com"
            );

            StringBuilder response = new StringBuilder();

            for (String email : emailsToDelete) {
                User user = userRepository.findByEmail(email);
                if (user != null) {
                    userRepository.delete(user);
                    response.append("Deleted: ").append(email).append("\n");
                } else {
                    response.append("Not found: ").append(email).append("\n");
                }
            }

            return ResponseEntity.ok(response.toString());
        }
    }



}
