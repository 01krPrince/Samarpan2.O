package in.codingage.samarpan.service;

import in.codingage.samarpan.controller.OtpController;
import org.springframework.http.ResponseEntity;

public interface OtpService {
    ResponseEntity<?> sendEmailOtp(String email);
    ResponseEntity<?> verifyOtp(OtpController.OtpVerificationRequest request);

    // New method if you support OTP-check + password reset in a single call
    ResponseEntity<?> verifyOtpAndResetPassword(String userId, String otp, String newPassword);
}
