Markdown
# 🏋️‍♂️ Fitness.AI - Microservices Platform

An enterprise-grade, event-driven fitness tracking and AI coaching application architected with **Spring Boot Microservices**, **Apache Kafka (KRaft)**, **MongoDB**, **React**, and **Google Gemini AI**.

---

## 📌 Architecture Overview

                  +-------------------------+
                  |  React Frontend (Vite)  |
                  |       (Port: 5173)      |
                  +------------+------------+
                               |
                               v
                  +-------------------------+
                  | Spring Cloud API Gateway|
                  |       (Port: 8080)      |
                  +------------+------------+
                               |
   +---------------------------+---------------------------+
   |                           |                           |
   v                           v                           v
+--------------+            +--------------+            +--------------+
| User Service |            | Activity Svc |            |Eureka Server |
| (Port: 8081) |            | (Port: 8082) |            | (Port: 8761) |
+--------------+            +------+-------+            +--------------+
|
(Publishes Event)
v
+-------------------------+
| Apache Kafka KRaft Mode |
|  Topic: activity-event  |
+------------+------------+
|
(Consumes Event)
v
+-------------------------+      +---------------+
|       AI Service        | <==> | Google Gemini |
|      (Port: 8083)       |      |   AI Engine   |
+------------+------------+      +---------------+
|
v
+-------------------------+
|    MongoDB Database     |
| (airecommendationfit...) |
+-------------------------+


---

## 🚀 Key Features

* **Microservices Ecosystem**: Loosely coupled services registered dynamically with Netflix Eureka.
* **Centralized Configuration**: Spring Cloud Config Server managing configuration profiles across environments.
* **Event-Driven AI Pipeline**: Non-blocking activity event ingestion via **Apache Kafka (ZooKeeper-less KRaft)**; activities are processed asynchronously.
* **AI-Powered Fitness Coaching**: Integrates **Google Gemini API** to generate workout analysis, pacing assessments, heart rate estimates, target improvements, and recovery safety guidelines.
* **Fault-Tolerant Resilience**: Configured reactive retry logic with exponential backoff and structured intelligent fallbacks against rate limits (HTTP 429/503).
* **Modern Reactive Web Client**: Built with Spring WebFlux `WebClient` for high-throughput asynchronous external API interaction.
* **Interactive UI**: Responsive React interface with continuous polling for background AI recommendation readiness.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend Framework** | Java 17, Spring Boot 3.3.x, Spring Cloud (2023.x) |
| **Microservices Tools** | Spring Cloud Gateway, Eureka Server, Spring Cloud Config |
| **Messaging & Events** | Apache Kafka 3.7.x (KRaft Mode) |
| **Databases** | MongoDB (NoSQL AI Store), MySQL / Relational Store |
| **AI Integration** | Google Gemini API (`gemini-flash-latest`), Spring WebClient |
| **Frontend** | React, Tailwind CSS, Vite, Axios |
| **Build & Utilities** | Maven, Lombok, Jackson JSON |

---

## 📂 Repository Structure

SBM-Starter-Project/
├── configserver/          # Spring Cloud Config Server (Port: 8888)
├── eureka/                # Netflix Eureka Service Discovery (Port: 8761)
├── gateway/               # Spring Cloud API Gateway (Port: 8080)
├── userservice/           # User Authentication & Profiles (Port: 8081)
├── activityservice/       # Workout Tracking & Kafka Producer (Port: 8082)
├── aiservice/             # Kafka Consumer, Gemini AI & MongoDB (Port: 8083)
└── fitness-app-frontend/  # React Application (Port: 5173)


---

## ⚙️ Service Startup Order

Start the services sequentially to ensure proper registration and config bindings:

1. **Infrastructure**:
   * Start **Apache Kafka in KRaft Mode** (`localhost:9092`)
   * Start **MongoDB** (`localhost:27017`)
2. **`configserver`** (Port: `8888`)
3. **`eureka`** (Port: `8761`)
4. **`gateway`** (Port: `8080`)
5. **`userservice`** (Port: `8081`)
6. **`activityservice`** (Port: `8082`)
7. **`aiservice`** (Port: `8083`)
8. **`fitness-app-frontend`**:
   ```bash
   cd fitness-app-frontend
   npm install
   npm run dev
🔑 Environment Configuration
Add your Gemini API credentials to configserver/src/main/resources/config/ai-service.yml or your active profile:

YAML
gemini:
  api:
    url: [https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent](https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent)
    key: YOUR_GEMINI_API_KEY
📊 Sample AI Recommendation Output
JSON
{
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
📜 License
This project is open source and available under the MIT License.
