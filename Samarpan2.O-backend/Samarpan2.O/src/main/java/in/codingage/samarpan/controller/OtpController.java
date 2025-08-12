package in.codingage.samarpan.controller;

import in.codingage.samarpan.service.OtpService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/otp")
@Validated
@Slf4j
public class OtpController {

    private final OtpService otpService;

    public OtpController(OtpService otpService) {
        this.otpService = otpService;
    }

    // Send OTP endpoint unchanged
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendEmailOtp(@RequestParam @Email String email) {
        log.info("Received OTP send request for email: {}", email);
        return otpService.sendEmailOtp(email);
    }

    // Simple OTP verification endpoint unchanged
    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody OtpVerificationRequest request) {
        log.info("Received OTP verify request for userId: {}", request.getUserId());
        return otpService.verifyOtp(request);
    }

    // Removed the /reset-password endpoint that required a reset token

    // Example: If you want to allow setting password along with OTP verification,
    // you can create a new endpoint like this:
    @PostMapping("/verify-and-reset-password")
    public ResponseEntity<?> verifyOtpAndResetPassword(@Valid @RequestBody OtpAndPasswordRequest request) {
        log.info("Received OTP and password reset request for userId: {}", request.getUserId());
        // You’ll need a corresponding method in OtpService
        return otpService.verifyOtpAndResetPassword(request.getUserId(), request.getOtp(), request.getNewPassword());
    }

    // DTO for *just* OTP verification
    @Data
    public static class OtpVerificationRequest {
        @NotBlank
        private String userId;
        @NotBlank
        private String otp;
    }

    // DTO for verifying OTP + resetting password in one step
    @Data
    public static class OtpAndPasswordRequest {
        @NotBlank
        private String userId;
        @NotBlank
        private String otp;
        @NotBlank
        private String newPassword;
    }
}
