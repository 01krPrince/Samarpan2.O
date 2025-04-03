package in.codingage.samarpan.controller;

import in.codingage.samarpan.exception.ApplicationException;
import in.codingage.samarpan.model.User;
import in.codingage.samarpan.model.auth.LoginRequest;
import in.codingage.samarpan.model.auth.LoginResponse;
import in.codingage.samarpan.model.auth.MessageResponse;
import in.codingage.samarpan.model.auth.SignupRequest;
import in.codingage.samarpan.repository.UserRepository;
import in.codingage.samarpan.security.jwt.JwtUtils;
import in.codingage.samarpan.security.services.impl.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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

        LoginResponse loginResponse = new LoginResponse(jwt, user, false);

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/signup/student")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getContact())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: This contact number is is already registered!"));
        }

        if (null != signUpRequest.getEmail() && userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }


        User user = new User(signUpRequest.getEmail(), signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()), signUpRequest.getContact(), signUpRequest.getInstituteName(), false, false);


        Set<String> roles = new HashSet<>();
        roles.add("STUDENT");
        user.setRoles(roles);
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


        User user = new User(signUpRequest.getEmail(), signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()), signUpRequest.getContact(), signUpRequest.getInstituteName(), false, false);


        Set<String> roles = new HashSet<>();
        roles.add("ADMIN");
        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        savedUser.setAccountNonExpired(true);
        savedUser.setActivated(true);

        userRepository.save(savedUser);

        return ResponseEntity.ok("User registered successfully!");
    }
}
