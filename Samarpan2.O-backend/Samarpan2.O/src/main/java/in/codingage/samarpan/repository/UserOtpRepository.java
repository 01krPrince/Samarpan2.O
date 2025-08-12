package in.codingage.samarpan.repository;

import in.codingage.samarpan.model.auth.otp.UserOtp;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UserOtpRepository extends MongoRepository<UserOtp, String> {

    Optional<UserOtp> findByUserIdAndOtpAndUsedFalse(String userId, String otp);

    Optional<UserOtp> findTopByUserIdAndCreatedAtAfterOrderByCreatedAtDesc(String userId, LocalDateTime oneHourAgo);
}
