package com.fitness.aiservice.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
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
        // Correct request body, matching the cURL command
        Map<String, Object> requestBody = Map.of(
                "model", "gemini-3.6-flash",
                "input", question
        );

        // Correct request format: API key in header
        GeminiResponse response = webClient.post()
                .uri(geminiApiUrl)
                .header("x-goog-api-key", geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(GeminiResponse.class)
                .block();

        // Correct response parsing, matching the Postman output
        if (response != null && response.getSteps() != null) {
            for (Step step : response.getSteps()) {
                if ("model_output".equals(step.getType()) && step.getContent() != null) {
                    for (Content content : step.getContent()) {
                        if ("text".equals(content.getType()) && content.getText() != null) {
                            return content.getText();
                        }
                    }
                }
            }
        }
        return "No response from AI.";
    }

    // Correct response classes to match the actual JSON from the '/interactions' endpoint
    @Data
    private static class GeminiResponse {
        private List<Step> steps;
    }

    @Data
    private static class Step {
        private String type;
        private List<Content> content;
    }

    @Data
    private static class Content {
        private String type;
        private String text;
    }
}
