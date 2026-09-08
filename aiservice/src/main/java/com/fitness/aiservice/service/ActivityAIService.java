package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {

    private final GeminiService geminiService;
    private final ObjectMapper mapper = new ObjectMapper();

    public Recommendation generateRecommendation(Activity activity) {
        String prompt = createPromptForActivity(activity);
        String aiResponse = geminiService.getAnswer(prompt);
        log.info("RESPONSE FROM AI: {}", aiResponse);
        return processAiResponse(activity, aiResponse);
    }

    private Recommendation processAiResponse(Activity activity, String aiResponse) {
        try {
            // Clean markdown blocks if present
            String cleanedResponse = aiResponse
                    .replaceAll("(?i)```json", "")
                    .replaceAll("```", "")
                    .trim();

            // Safety check: Agar response achanak cut ho gaya ho toh close quotes and braces
            cleanedResponse = repairTruncatedJson(cleanedResponse);

            JsonNode rootNode = mapper.readTree(cleanedResponse);
            JsonNode analysisNode = rootNode.path("analysis");

            StringBuilder fullAnalysis = new StringBuilder();

            if (analysisNode.isTextual()) {
                fullAnalysis.append(analysisNode.asText());
            } else {
                addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall:");
                addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace:");
                addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "Heart Rate:");
                addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories:");
            }

            List<String> improvements = extractImprovements(rootNode.path("improvements"));
            List<String> suggestions = extractSuggestions(rootNode.path("suggestions"));
            List<String> safety = extractSafetyGuidelines(rootNode.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    .createdAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            log.error("Failed to parse AI response JSON: {}", e.getMessage());
            return createDefaultRecommendation(activity);
        }
    }

    private Recommendation createDefaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .activityType(activity.getType())
                .recommendation("Solid effort completed. Aerobic endurance maintained throughout the workout duration with consistent energy output.")
                .improvements(Arrays.asList(
                        "Cadence Consistency: Focus on maintaining a regular step rhythm to optimize efficiency.",
                        "Gradual Progression: Increase workout volume by no more than 10% per week."
                ))
                .suggestions(Arrays.asList(
                        "Recovery Session: 15-minute low intensity cool-down walk or light stretching.",
                        "Next Workout: Steady-state aerobic session maintaining current heart rate zone."
                ))
                .safety(Arrays.asList(
                        "Hydrate with water and electrolytes post-workout.",
                        "Perform lower body stretches focusing on calves and hamstrings.",
                        "Listen to your body and prioritize recovery if experiencing joint fatigue."
                ))
                .createdAt(LocalDateTime.now())
                .build();
    }

    private List<String> extractSafetyGuidelines(JsonNode safetyNode) {
        List<String> safety = new ArrayList<>();
        if (safetyNode.isArray()) {
            safetyNode.forEach(item -> {
                String text = item.isObject() ? item.path("point").asText(item.toString()) : item.asText();
                if (!text.isBlank()) safety.add(text);
            });
        }
        return safety.isEmpty() ?
                Collections.singletonList("Follow general hydration and warm-up safety guidelines") :
                safety;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();
        if (suggestionsNode.isArray()) {
            suggestionsNode.forEach(suggestion -> {
                if (suggestion.isTextual()) {
                    suggestions.add(suggestion.asText());
                } else {
                    String workout = suggestion.path("workout").asText();
                    String description = suggestion.path("description").asText();
                    if (!workout.isBlank() || !description.isBlank()) {
                        suggestions.add(String.format("%s: %s", workout, description));
                    }
                }
            });
        }
        return suggestions.isEmpty() ?
                Collections.singletonList("Active Recovery: 20-minute low-intensity walk and stretching") :
                suggestions;
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();
        if (improvementsNode.isArray()) {
            improvementsNode.forEach(improvement -> {
                if (improvement.isTextual()) {
                    improvements.add(improvement.asText());
                } else {
                    String area = improvement.path("area").asText();
                    String detail = improvement.path("recommendation").asText();
                    if (!area.isBlank() || !detail.isBlank()) {
                        improvements.add(String.format("%s: %s", area, detail));
                    }
                }
            });
        }
        return improvements.isEmpty() ?
                Collections.singletonList("Pacing Consistency: Maintain an even pacing profile throughout the effort") :
                improvements;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if (!analysisNode.path(key).isMissingNode() && !analysisNode.path(key).asText().isBlank()) {
            fullAnalysis.append(prefix)
                    .append(" ")
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
        You are an elite fitness coach. Analyze this workout and respond strictly with valid JSON.
        Keep every text field short and concise (under 25 words per point) so the JSON is never cut off.

        JSON FORMAT REQUIREMENT:
        {
          "analysis": {
            "overall": "Brief overall performance evaluation",
            "pace": "Brief pacing commentary",
            "heartRate": "Estimated or target heart rate effort",
            "caloriesBurned": "Energy expenditure commentary"
          },
          "improvements": [
            {
              "area": "Focus Area",
              "recommendation": "Concise improvement tip"
            }
          ],
          "suggestions": [
            {
              "workout": "Workout Title",
              "description": "Brief next session plan"
            }
          ],
          "safety": [
            "Concise safety or recovery advice",
            "Hydration or warm-up recommendation"
          ]
        }

        Workout Data:
        Activity Type: %s
        Duration: %d minutes
        Calories: %d
        Metrics: %s
        """,
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                activity.getAdditionalMetrics() != null ? activity.getAdditionalMetrics().toString() : "None"
        );
    }

    /**
     * Fallback helper to prevent JsonEOFException if model response gets truncated.
     */
    private String repairTruncatedJson(String json) {
        if (json.endsWith("}")) {
            return json;
        }
        // If string was cut off mid-way
        int lastQuote = json.lastIndexOf("\"");
        if (lastQuote != -1) {
            String sub = json.substring(0, lastQuote + 1);
            if (!sub.endsWith("}")) {
                return sub + "]}";
            }
            return sub;
        }
        return json;
    }
}