package org.sergei.backend.ai;

import dev.langchain4j.model.ollama.OllamaChatModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Set;

@Service
public class AiAssistantService {

    private static final Set<String> ALLOWED = Set.of("Work", "Personal", "Health", "Learning", "Finance");

    private final OllamaChatModel model;

    public AiAssistantService(
            @Value("${OLLAMA_BASE_URL}") String baseUrl,
            @Value("${OLLAMA_MODEL:mistral}") String modelName
    ) {
        this.model = OllamaChatModel.builder()
                .baseUrl(baseUrl)
                .modelName(modelName)
                .timeout(Duration.ofSeconds(30))
                .build();
    }

    public String categorizeTask(String title, String description) {
        String text = (title == null ? "" : title) + "\n" + (description == null ? "" : description);

        String prompt = """
                You are a strict classifier.
                Categorize the task into exactly one of the categories:
                Work, Personal, Health, Learning, Finance.

                Return ONLY the category name, nothing else.

                Task:
                %s
                """.formatted(text);

        String raw = model.chat(prompt);
        String cleaned = normalize(raw);

        return ALLOWED.contains(cleaned) ? cleaned : "Personal";
    }

    private String normalize(String raw) {
        if (raw == null) return "";
        String x = raw.trim();
        // иногда модель добавляет точки/кавычки
        x = x.replace("\"", "").replace(".", "").trim();
        // иногда возвращает "Category: Work"
        if (x.toLowerCase().startsWith("category:")) {
            x = x.substring("category:".length()).trim();
        }
        // нормализуем регистр
        if (x.equalsIgnoreCase("work")) return "Work";
        if (x.equalsIgnoreCase("personal")) return "Personal";
        if (x.equalsIgnoreCase("health")) return "Health";
        if (x.equalsIgnoreCase("learning")) return "Learning";
        if (x.equalsIgnoreCase("finance")) return "Finance";
        return x;
    }
}
