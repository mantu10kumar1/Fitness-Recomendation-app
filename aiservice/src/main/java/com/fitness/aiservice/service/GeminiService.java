package com.fitness.aiservice.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public GeminiService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String getAnswer(String question) {
        // Direct call without long retry loop to capture immediate real error
        String response = executeGeminiCall(geminiApiUrl, question);
        if (response != null) {
            return response;
        }

        log.error("Gemini API call failed. Using structured fallback.");
        return getStructuredJsonFallback();
    }

    private String executeGeminiCall(String endpointUrl, String question) {
        try {
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", question)))
                    )
            );

            String targetUrl = endpointUrl.contains("key=")
                    ? endpointUrl
                    : endpointUrl.trim() + "?key=" + geminiApiKey.trim();

            GeminiResponse response = webClient.post()
                    .uri(java.net.URI.create(targetUrl))
                    .header("X-goog-api-key", geminiApiKey.trim())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(GeminiResponse.class)
                    .timeout(Duration.ofSeconds(12))
                    .block();

            if (response != null && response.getCandidates() != null && !response.getCandidates().isEmpty()) {
                Candidate candidate = response.getCandidates().get(0);
                if (candidate.getContent() != null && candidate.getContent().getParts() != null && !candidate.getContent().getParts().isEmpty()) {
                    String raw = candidate.getContent().getParts().get(0).getText();
                    return raw.replace("```json", "").replace("```", "").trim();
                }
            }
        } catch (WebClientResponseException e) {
            log.error("Google Gemini HTTP Error: Status={}, ResponseBody={}",
                    e.getStatusCode(), e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Call failed on {}: {}", endpointUrl, e.getMessage());
        }
        return null;
    }

    private String getStructuredJsonFallback() {
        return """
        {
          "analysis": {
            "overall": "Solid aerobic session maintaining steady effort and cardiovascular output.",
            "pace": "Even pacing profile suitable for aerobic endurance base building.",
            "heartRate": "Maintained in target aerobic training zone.",
            "caloriesBurned": "Consistent caloric expenditure aligned with workout duration."
          },
          "improvements": [
            {
              "area": "Cadence Optimization",
              "recommendation": "Aim for 170-175 spm to reduce ground impact stress on joints."
            },
            {
              "area": "Progressive Overload",
              "recommendation": "Limit weekly duration increments to no more than 10%."
            }
          ],
          "suggestions": [
            {
              "workout": "Active Recovery",
              "description": "15-minute low intensity walk followed by light mobility work."
            },
            {
              "workout": "Zone 2 Base Run",
              "description": "45-minute conversational pace session to build aerobic capacity."
            }
          ],
          "safety": [
            "Drink plenty of fluids with electrolytes post-workout.",
            "Complete 5 minutes of lower limb stretches focusing on calves and hamstrings."
          ]
        }
        """;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class GeminiResponse {
        private List<Candidate> candidates;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class Candidate {
        private Content content;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class Content {
        private List<Part> parts;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class Part {
        private String text;
    }
}