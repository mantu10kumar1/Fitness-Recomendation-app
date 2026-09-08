# 🏋️‍♂️ Fitness.AI - Microservices-Based Fitness Platform

An enterprise-grade, event-driven fitness tracking and AI coaching application architected with **Spring Boot Microservices**, **Apache Kafka (KRaft)**, **MongoDB**, **React**, and **Google Gemini AI**.

---

## 📌 Architecture Overview

```mermaid
flowchart TD
    UI["💻 React Frontend (Vite)<br>Port: 5173"]
    GW["🌐 Spring Cloud API Gateway<br>Port: 8080"]
    EU["🔍 Eureka Service Discovery<br>Port: 8761"]
    US["👤 User Service<br>Port: 8081"]
    AS["🏃 Activity Service<br>Port: 8082"]
    KF[("⚡ Apache Kafka (KRaft Mode)<br>Topic: activity-event")]
    AIS["🤖 AI Service<br>Port: 8083"]
    GEM["✨ Google Gemini API<br>(AI Engine)"]
    DB[("🍃 MongoDB Database<br>(airecommendationfitness)")]

    UI --> GW
    GW -.-> EU
    GW --> US
    GW --> AS
    GW --> AIS

    AS -- "Publishes Event" --> KF
    KF -- "Consumes Event" --> AIS
    AIS <--> GEM
    AIS --> DB

    classDef client fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#fff;
    classDef gateway fill:#0f172a,stroke:#818cf8,stroke-width:2px,color:#fff;
    classDef svc fill:#1e1e2e,stroke:#a78bfa,stroke-width:2px,color:#fff;
    classDef broker fill:#312e81,stroke:#c084fc,stroke-width:2px,color:#fff;
    classDef external fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#fff;
    classDef db fill:#065f46,stroke:#10b981,stroke-width:2px,color:#fff;

    class UI client;
    class GW gateway;
    class EU,US,AS,AIS svc;
    class KF broker;
    class GEM external;
    class DB db;


    🚀 Key FeaturesMicroservices Ecosystem: Loosely coupled services registered dynamically with Netflix Eureka.Centralized Configuration: Spring Cloud Config Server managing configuration profiles across environments.Event-Driven AI Pipeline: Non-blocking activity event ingestion via Apache Kafka (ZooKeeper-less KRaft); activities are processed asynchronously.AI-Powered Fitness Coaching: Integrates Google Gemini API to generate workout analysis, pacing assessments, heart rate estimates, target improvements, and recovery safety guidelines.Fault-Tolerant Resilience: Configured reactive retry logic with exponential backoff and structured intelligent fallbacks against rate limits (HTTP 429/503).Modern Reactive Web Client: Built with Spring WebFlux WebClient for high-throughput asynchronous external API interaction.Interactive UI: Responsive React interface with continuous polling for background AI recommendation readiness.🛠 Tech StackLayerTechnologiesBackend FrameworkJava 17, Spring Boot 3.3.x, Spring Cloud (2023.x)Microservices ToolsSpring Cloud Gateway, Eureka Server, Spring Cloud ConfigMessaging & EventsApache Kafka 3.7.x (KRaft Mode)DatabasesMongoDB (NoSQL AI Store), MySQL / Relational StoreAI IntegrationGoogle Gemini API (gemini-flash-latest), Spring WebClientFrontendReact, Tailwind CSS, Vite, AxiosBuild & UtilitiesMaven, Lombok, Jackson JSON📂 Repository StructureSBM-Starter-Project/
├── configserver/          # Spring Cloud Config Server (Port: 8888)
├── eureka/                # Netflix Eureka Service Discovery (Port: 8761)
├── gateway/               # Spring Cloud API Gateway (Port: 8080)
├── userservice/           # User Authentication & Profiles (Port: 8081)
├── activityservice/       # Workout Tracking & Kafka Producer (Port: 8082)
├── aiservice/             # Kafka Consumer, Gemini AI & MongoDB (Port: 8083)
└── fitness-app-frontend/  # React Application (Port: 5173)
⚙️ Service Startup OrderStart the services sequentially to ensure proper registration and config bindings:Infrastructure:Start Apache Kafka in KRaft Mode (localhost:9092)Start MongoDB (localhost:27017)configserver (Port: 8888)eureka (Port: 8761)gateway (Port: 8080)userservice (Port: 8081)activityservice (Port: 8082)aiservice (Port: 8083)fitness-app-frontend:Bashcd fitness-app-frontend
npm install
npm run dev
🔑 Environment ConfigurationAdd your Gemini API credentials to configserver/src/main/resources/config/ai-service.yml or your active profile:YAMLgemini:
  api:
    url: [https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent](https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent)
    key: YOUR_GEMINI_API_KEY
📊 Sample AI Recommendation OutputJSON{
  "analysis": {
    "overall": "Solid 45-minute aerobic base run showing consistent endurance and effective cardiovascular conditioning.",
    "pace": "Consistent, sustainable effort maintained throughout the session without signs of premature fatigue.",
    "heartRate": "Estimated moderate aerobic zone 2-3 effort, approximately 135 to 155 bpm.",
    "caloriesBurned": "480 kcal burned indicates a highly efficient, productive moderate-intensity cardiovascular session."
  },
  "improvements": [
    {
      "area": "Cadence Tracking",
      "recommendation": "Use a cadence sensor to maintain optimal 170-180 strides per minute."
    }
  ],
  "suggestions": [
    {
      "workout": "Tempo Interval Run",
      "description": "Warm up 10 mins, alternate 3-min threshold pace with 90-sec recovery."
    }
  ],
  "safety": [
    "Rehydrate with at least 500ml water and electrolytes post-workout.",
    "Include 5-10 minutes of calf and hamstring static stretches."
  ]
}
📜 LicenseThis project is open source and available under the MIT License.
