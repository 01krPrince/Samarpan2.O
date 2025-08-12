package in.codingage.samarpan.service.impl;

import in.codingage.samarpan.controller.OtpController.OtpVerificationRequest;
import in.codingage.samarpan.repository.UserRepository;
import in.codingage.samarpan.model.User;
import in.codingage.samarpan.service.OtpService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class OtpServiceImpl implements OtpService {

    private static final int OTP_LENGTH = 6;
    private static final String OTP_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int OTP_EXPIRY_MINUTES = 1;
    private static final int OTP_REQUEST_INTERVAL_MINUTES = 1;

    private final UserServiceImpl userService;
    private final JavaMailSender mailSender;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final Map<String, UserOtpEntry> otpCache = new ConcurrentHashMap<>();

    public OtpServiceImpl(UserServiceImpl userService, JavaMailSender mailSender) {
        this.userService = userService;
        this.mailSender = mailSender;
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(OTP_LENGTH);
        for (int i = 0; i < OTP_LENGTH; i++) {
            sb.append(OTP_CHARS.charAt(random.nextInt(OTP_CHARS.length())));
        }
        return sb.toString();
    }

    private LocalDateTime now() {
        return LocalDateTime.now(ZoneOffset.UTC);
    }

    private String formatDuration(Duration duration) {
        long seconds = duration.getSeconds();
        long absSeconds = Math.abs(seconds);
        return String.format("%02d:%02d:%02d",
                absSeconds / 3600,
                (absSeconds % 3600) / 60,
                absSeconds % 60);
    }

    private Optional<String> canRequestOtp(String userId) {
        UserOtpEntry lastOtp = otpCache.get(userId);
        if (lastOtp != null) {
            LocalDateTime otpCreatedAt = lastOtp.getCreatedAt();
            LocalDateTime earliestNextOtpTime = otpCreatedAt.plusMinutes(OTP_REQUEST_INTERVAL_MINUTES);
            if (earliestNextOtpTime.isAfter(now())) {
                Duration waitDuration = Duration.between(now(), earliestNextOtpTime);
                return Optional.of(formatDuration(waitDuration));
            }
        }
        return Optional.empty();
    }

    @Override
    public ResponseEntity<?> sendEmailOtp(String email) {
        User user = userService.getUserByEmail(email);
        if (user == null) {
            log.warn("User with email {} not found", email);
            return ResponseEntity.badRequest().body("Email not registered");
        }

        Optional<String> denyMessage = canRequestOtp(user.getId());
        if (denyMessage.isPresent()) {
            log.info("User {} already requested OTP recently, time left: {}", user.getUsername(), denyMessage.get());
            return ResponseEntity.badRequest()
                    .body("You’ve already received an OTP recently. Please try again after " + denyMessage.get());
        }

        String otp = generateOtp();
        otpCache.put(user.getId(), new UserOtpEntry(otp, now()));

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Your OTP Code");
            message.setText("Your OTP code is: " + otp + ". It is valid for " + OTP_EXPIRY_MINUTES + " minutes.");
            message.setFrom("noreply@samarpan.com");
            mailSender.send(message);

            log.info("Sent email OTP to {}", email);
            return ResponseEntity.ok("Email OTP sent successfully");
        } catch (Exception e) {
            log.error("Exception while sending email OTP", e);
            return ResponseEntity.status(500).body("Failed to send email OTP");
        }
    }

    @Override
    public ResponseEntity<?> verifyOtp(OtpVerificationRequest request) {
        log.info("Verifying OTP for userId: {}", request.getUserId());
        Optional<User> userOpt = userService.findById(request.getUserId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid User");
        }
        User user = userOpt.get();

        UserOtpEntry cachedOtp = otpCache.get(user.getId());
        if (cachedOtp == null) {
            log.info("OTP not found for userId {}", request.getUserId());
            return ResponseEntity.badRequest().body("OTP verification failed");
        }

        if (isOtpExpired(cachedOtp.getCreatedAt())) {
            otpCache.remove(user.getId());
            log.info("OTP expired for userId {}", request.getUserId());
            return ResponseEntity.badRequest().body("OTP expired");
        }

        if (!cachedOtp.getOtp().equalsIgnoreCase(request.getOtp())) {
            log.info("Invalid OTP entered for userId {}", request.getUserId());
            return ResponseEntity.badRequest().body("OTP verification failed");
        }

        otpCache.remove(user.getId());
        userService.verification(user.getEmail());
        log.info("OTP verified for userId {}", request.getUserId());


        return ResponseEntity.ok("OTP verified successfully");
    }

    @Override
    public ResponseEntity<?> verifyOtpAndResetPassword(String userId, String otp, String newPassword) {
        return null;
    }

    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void clearExpiredOtps() {
        LocalDateTime now = now();
        otpCache.entrySet().removeIf(entry -> isOtpExpired(entry.getValue().getCreatedAt()));
        log.debug("Expired OTPs cleared at {}", now);
    }

    private boolean isOtpExpired(LocalDateTime createdAt) {
        return createdAt.plusMinutes(OTP_EXPIRY_MINUTES).isBefore(now());
    }

    private static class UserOtpEntry {
        private final String otp;
        private final LocalDateTime createdAt;

        public UserOtpEntry(String otp, LocalDateTime createdAt) {
            this.otp = otp;
            this.createdAt = createdAt;
        }

        public String getOtp() {
            return otp;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }
    }
}
