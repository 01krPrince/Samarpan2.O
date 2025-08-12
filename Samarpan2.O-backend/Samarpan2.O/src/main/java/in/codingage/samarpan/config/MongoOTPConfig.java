package in.codingage.samarpan.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import jakarta.annotation.PostConstruct;

@Configuration
public class MongoOTPConfig {

    private final MongoTemplate mongoTemplate;

    public MongoOTPConfig(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @PostConstruct
    public void createTTLIndex() {
        mongoTemplate.indexOps("user_otps")
                .ensureIndex(new Index()
                        .on("createdAt", org.springframework.data.domain.Sort.Direction.ASC)
                        .expire(600));  // TTL in seconds (10 minutes)
    }
}
