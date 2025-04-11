package in.codingage.samarpan.service.impl;// File: KeepAliveScheduler.java

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class KeepAliveScheduler {

    private final RestTemplate restTemplate = new RestTemplate();

    // Runs every 14 minutes (Render free plan timeout is 15 mins)
    @Scheduled(fixedRate = 840000)
    public void keepAlive() {
        try {
            String url = "https://samarpan2-o.onrender.com/ping"; // Replace with your actual URL
            String response = restTemplate.getForObject(url, String.class);
            System.out.println("Keep-alive ping response: " + response);
        } catch (Exception e) {
            System.err.println("Keep-alive ping failed: " + e.getMessage());
        }
    }
}
