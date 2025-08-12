//package in.codingage.samarpan.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.Random;
//
//@Service
//@RestController
//@RequestMapping("/api/otp")
//public class MailService {
//
//    @Autowired
//    private JavaMailSender mailSender;
//
//    // Store OTPs in-memory (You can replace with DB for production)
//    private final Map<String, String> otpStorage = new HashMap<>();
//
//    // Send OTP
//    @PostMapping("/send")
//    public String sendOtp(@RequestParam String toEmail, @RequestParam String studentName) {
//        String otp = generateOtp();
//        otpStorage.put(toEmail, otp);
//
//        String subject = "Project Submission - OTP Verification";
//        String text = "Hello " + studentName + ",\n\n" +
//                "Thank you for submitting your project for admin review on our Student Project Portal.\n\n" +
//                "To verify your email, please use the following One-Time Password (OTP):\n\n" +
//                "🔐 OTP: " + otp + "\n\n" +
//                "This OTP is valid for the next 5 minutes.\n\n" +
//                "Regards,\nStudent Project Review Team";
//
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(toEmail);
//        message.setSubject(subject);
//        message.setText(text);
//
//        mailSender.send(message);
//        return "OTP sent to " + toEmail;
//    }
//
//    // Verify OTP
//    @PostMapping("/verify")
//    public String verifyOtp(@RequestParam String email, @RequestParam String otp) {
//        String storedOtp = otpStorage.get(email);
//        if (storedOtp != null && storedOtp.equals(otp)) {
//            otpStorage.remove(email); // Clear after success
//            return "✅ OTP verified successfully. Project submission verified.";
//        } else {
//            return "❌ Invalid OTP or email.";
//        }
//    }
//
//    private String generateOtp() {
//        Random random = new Random();
//        int otp = 100000 + random.nextInt(900000); // 6-digit OTP
//        return String.valueOf(otp);
//    }
//}
