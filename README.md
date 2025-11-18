CrisisLink - Multi-Agent Emergency Resource Coordinator

CrisisLink is a centralized, AI-powered platform that acts as a single, reliable point of contact during a crisis. It triages a user's needs and connects them to one of four specialized AI agents, each an expert in its specific domain.

This project is built using the Google Agent Development Kit (ADK), deployed as a set of microservices on Google Cloud Run, and backed by Google Cloud SQL databases.

🚀 The Problem & Solution

Problem: During a crisis—whether a natural disaster or a personal mental health emergency—accessing the right information is chaotic. People in distress search scattered websites and call multiple numbers, wasting precious time.

Solution: CrisisLink provides a single, empathetic, and intelligent chatbot. It understands the user's intent and routes their query to the correct AI agent, which is equipped with a verified database to provide fast, accurate, and actionable help.

✨ Features: The Four Agents

CrisisLink is composed of four distinct agents, each with a dedicated, verified database.

🚨 Emergency Response Agent: For users in immediate physical danger.

Use Case: "Flood in Bangalore, where is the nearest shelter?"

Data: Queries a database of 50+ helplines, hospitals, and shelters across major Indian cities.

❤️ Volunteer & Donation Agent: For community members who want to help.

Use Case: "Where can I donate blood for the flood victims?"

Data: Queries a database of 50+ verified blood banks, food camps, and NGO drop-off locations (e.g., Goonj, Akshaya Patra).

🛡️ Safety & Preparation Agent: For proactive and preventative guidance.

Use Case: "What should I put in an emergency kit?"

Data: Queries a database of 50+ official, step-by-step procedures from the NDMA for earthquakes, floods, fires, etc.

🎗️ Mental Health Support Agent: For users in severe emotional distress.

Use Case: "I feel hopeless and need to talk to someone."

Data: Queries a highly secure, verified database of 24/7 national crisis hotlines (e.g., Tele MANAS, KIRAN) to immediately connect the user with a trained professional.

🛠️ Technology Stack

Backend: Google Agent Development Kit (ADK), Python

Frontend: React, TypeScript, Vite, Docker

Database: Google Cloud SQL (PostgreSQL) x4

Deployment: Google Cloud Run x5 (4 agent services + 1 frontend service)

AI Model: Gemini (via Vertex AI)

🏗️ High-Level Design

This project is built on a microservice architecture. Each agent is a completely independent service, with its own deployment and its own isolated database.

Data Flow:

A user selects the "Emergency" agent on the frontend.

The frontend sends the API request (SSE) to the emergency-response-service URL on Cloud Run.

A user types, "Flood in Bangalore."

The ADK agent receives this, identifies the entities (city: Bangalore, crisis_type: flood), and uses its find_emergency_resources tool.

The tool executes a SQL query against the emergency-resources Cloud SQL database.

The database returns a list of helplines and shelters.

The agent formats this data into an empathetic, human-readable response and streams it back to the user.

📚 Sample Dataset / Artifacts Description

Our project's key artifacts are the four comprehensive, pre-populated PostgreSQL databases. This data was sourced from official government portals (like the NDMA), verified NGOs, and authoritative data to ensure reliability.

emergency_resources (50 Entries): This database powers the Emergency Response Agent. It contains a list of hospitals, police stations, shelters, and helplines, all indexed by city, crisis_type, and resource_type.

community_aid (50 Entries): This database powers the Volunteer & Donation Agent. It contains a list of verified blood banks, food camps, and NGO centers (like Goonj, Akshaya Patra) indexed by city and aid_type.

safety_procedures (50 Entries): This database powers the Safety & Preparation Agent. It contains step-by-step instructions for various crises (earthquake, flood, emergency_kit, fire), with each step, procedure, and source (e.g., "NDMA") stored in its own row.

mental_health_support (50 Entries): This database powers the Mental Health Support Agent. It contains a carefully verified list of national and state-level helplines, including 24/7 hotlines like Tele MANAS, KIRAN, and Childline.

📖 Setup & Deployment Guide

Follow these steps to deploy the entire application from scratch.

Prerequisites

A Google Cloud Project.

Google Cloud SDK (gcloud) installed and authenticated.

Google Agent Development Kit (adk) installed.

PostgreSQL Client (psql) installed (to populate the databases).

Docker installed (for the frontend).

Step 1: Enable Google Cloud APIs

gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  aiplatform.googleapis.com \
  iam.googleapis.com \
  cloudbuild.googleapis.com


Step 2: Create Cloud SQL Database Instances

Run these commands to create the four dedicated PostgreSQL instances. Replace [YOUR_SECURE_PASSWORD] with a password of your choice.

# 1. Emergency Response DB
gcloud sql instances create emergency-response-instance --database-version=POSTGRES_15 --tier=db-g1-small --region=us-central1 --edition=ENTERPRISE --root-password=[YOUR_SECURE_PASSWORD]

# 2. Volunteer & Donation DB
gcloud sql instances create volunteer-donation-instance --database-version=POSTGRES_15 --tier=db-g1-small --region=us-central1 --edition=ENTERPRISE --root-password=[YOUR_SECURE_PASSWORD]

# 3. Safety & Preparation DB
gcloud sql instances create safety-prep-instance --database-version=POSTGRES_15 --tier=db-g1-small --region=us-central1 --edition=ENTERPRISE --root-password=[YOUR_SECURE_PASSWORD]

# 4. Mental Health Support DB
gcloud sql instances create mental-health-instance --database-version=POSTGRES_15 --tier=db-g1-small --region=us-central1 --edition=ENTERPRISE --root-password=[YOUR_SECURE_PASSWORD]


Step 3: Create Tables and Populate Data

You must do this for all four instances.

Get your instance's IP Address:

# Example for the emergency instance
gcloud sql instances describe emergency-response-instance --format="value(ipAddresses[0].ipAddress)"


(Repeat for the other 3 instances).

Connect to the DB (e.g., for Emergency):

psql "sslmode=disable host=[YOUR_DB_IP] user=postgres dbname=postgres password=[YOUR_SECURE_PASSWORD]"


Create the Table: Paste the CREATE TABLE SQL (e.g., CREATE TABLE emergency_resources (...);) into the psql prompt.

Upload the CSV Data:

Place the emergency_resources.csv file in your current directory.

Exit psql (type \q).

Run the \copy command to bulk-upload your CSV.

# Example for the emergency_resources.csv
psql "sslmode=disable host=[YOUR_DB_IP] user=postgres dbname=postgres password=[YOUR_SECURE_PASSWORD]" \
     -c "\copy emergency_resources FROM 'emergency_resources.csv' WITH CSV HEADER"


Repeat this process for the other three databases, using their respective IPs, table schemas, and CSV files (community_aid.csv, safety_procedures.csv, mental_health_support.csv).

Step 4: Configure the ADK Toolbox

Create a tools.yaml file in your project's root. This file tells your agents how to connect to their databases. Replace the placeholders with your project ID and password.

# tools.yaml
sources:
  emergency-db-source:
    kind: cloud-sql-postgres
    project: [YOUR_PROJECT_ID]
    region: us-central1
    instance: emergency-response-instance
    database: postgres
    user: postgres
    password: [YOUR_SECURE_PASSWORD]
  volunteer-db-source:
    kind: cloud-sql-postgres
    project: [YOUR_PROJECT_ID]
    region: us-central1
    instance: volunteer-donation-instance
    database: postgres
    user: postgres
    password: [YOUR_SECURE_PASSWORD]
  safety-db-source:
    kind: cloud-sql-postgres
    project: [YOUR_PROJECT_ID]
    region: us-central1
    instance: safety-prep-instance
    database: postgres
    user: postgres
    password: [YOUR_SECURE_PASSWORD]
  mental-health-db-source:
    kind: cloud-sql-postgres
    project: [YOUR_PROJECT_ID]
    region: us-central1
    instance: mental-health-instance
    database: postgres
    user: postgres
    password: [YOUR_SECURE_PASSWORD]

tools:
  find_emergency_resources:
    kind: postgres-sql
    source: emergency-db-source
    description: Search for emergency resources like helplines, shelters, or hospitals based on a city and crisis type.
    parameters:
      - {name: city, type: string, description: 'The city to search in (e.g., ''Bangalore'', ''Mumbai'').'}
      - {name: crisis_type, type: string, description: 'The type of crisis (e.g., ''flood'', ''fire'', ''medical'', ''general'').'}
    statement: "SELECT name, resource_type, address, phone FROM emergency_resources WHERE city ILIKE '%' || $1 || '%' AND crisis_type ILIKE '%' || $2 || '%';"
  find_community_aid:
    kind: postgres-sql
    source: volunteer-db-source
    description: Search for community aid locations like blood banks, food camps, or volunteer centers based on a city and the type of aid.
    parameters:
      - {name: city, type: string, description: 'The city to search in (e.g., ''Delhi'', ''Chennai'').'}
      - {name: aid_type, type: string, description: 'The type of aid needed (e.g., ''blood_bank'', ''food_camp'', ''volunteer_center'').'}
    statement: "SELECT organization_name, aid_type, address, contact_phone, operating_hours, website FROM community_aid WHERE city ILIKE '%' || $1 || '%' AND aid_type ILIKE '%' || $2 || '%';"
  get_safety_procedures:
    kind: postgres-sql
    source: safety-db-source
    description: Retrieve safety procedures, checklists, or "what-to-do" steps for a specific crisis (e.g., 'earthquake', 'emergency_kit', 'flood').
    parameters:
      - {name: crisis_type, type: string, description: 'The crisis to get procedures for (e.g., ''earthquake'', ''flood'', ''fire'').'}
    statement: "SELECT procedure_name, step_number, instruction_text, source FROM safety_procedures WHERE crisis_type ILIKE $1 ORDER BY step_number;"
  query_helpline_database:
    kind: postgres-sql
    source: mental-health-db-source
    description: Retrieves the complete list of all verified mental health helplines from the database.
    statement: "SELECT organization_name, description, resource_type, phone_number, website, is_24_7, region FROM mental_health_support ORDER BY is_24_7 DESC, region;"

toolsets:
  emergency_toolset: [find_emergency_resources]
  volunteer_toolset: [find_community_aid]
  safety_toolset: [get_safety_procedures]
  mental_health_toolset: [query_helpline_database]


Step 5: Run the Toolbox

Run this command in your terminal. You must keep this running while you deploy your agents.

adk run-toolbox --tools_config=tools.yaml --port=5000


Step 6: Deploy the 4 Backend Agents

In a new terminal, set your project ID as an environment variable:
export GOOGLE_CLOUD_PROJECT="[YOUR_PROJECT_ID]"

Then, run these command blocks one by one.

# 1. Deploy EMERGENCY Agent
export GOOGLE_CLOUD_LOCATION="us-central1"
export AGENT_PATH="emergency-response/"
export SERVICE_NAME="emergency-response-service"
export APP_NAME="emergency_response_agent"
export GOOGLE_GENAI_USE_VERTEXAI=True
adk deploy cloud_run --project=$GOOGLE_CLOUD_PROJECT --region=$GOOGLE_CLOUD_LOCATION --service_name=$SERVICE_NAME --app_name=$APP_NAME --with_ui $AGENT_PATH

# 2. Deploy VOLUNTEER Agent
export GOOGLE_CLOUD_LOCATION="us-central1"
export AGENT_PATH="volunteer-donation/"
export SERVICE_NAME="volunteer-donation-service"
export APP_NAME="volunteer_donation_agent"
export GOOGLE_GENAI_USE_VERTEXAI=True
adk deploy cloud_run --project=$GOOGLE_CLOUD_PROJECT --region=$GOOGLE_CLOUD_LOCATION --service_name=$SERVICE_NAME --app_name=$APP_NAME --with_ui $AGENT_PATH

# 3. Deploy SAFETY Agent
export GOOGLE_CLOUD_LOCATION="us-central1"
export AGENT_PATH="safety_preparation/"
export SERVICE_NAME="safety-prep-service"
export APP_NAME="safety_preparation_agent"
export GOOGLE_GENAI_USE_VERTEXAI=True
adk deploy cloud_run --project=$GOOGLE_CLOUD_PROJECT --region=$GOOGLE_CLOUD_LOCATION --service_name=$SERVICE_NAME --app_name=$APP_NAME --with_ui $AGENT_PATH

# 4. Deploy MENTAL HEALTH Agent
export GOOGLE_CLOUD_LOCATION="us-central1"
export AGENT_PATH="sucide_prevention/"
export SERVICE_NAME="mental-health-service"
export APP_NAME="mental_health_support_agent"
export GOOGLE_GENAI_USE_VERTEXAI=True
adk deploy cloud_run --project=$GOOGLE_CLOUD_PROJECT --region=$GOOGLE_CLOUD_LOCATION --service_name=$SERVICE_NAME --app_name=$APP_NAME --with_ui $AGENT_PATH


After each command, save the Service URL it provides.

Step 7: Deploy the Frontend

Critical: Open your React app's code (e.g., services/api.ts). You must update the hardcoded localhost URLs to point to your new Cloud Run service URLs from Step 6. Your code will need logic to pick the correct URL based on the user's agent selection.

Navigate to your frontend's root directory (the one with the Dockerfile).

Run the deployment command:

export GOOGLE_CLOUD_PROJECT="[YOUR_PROJECT_ID]"
export GOOGLE_CLOUD_LOCATION="us-central1"
export SERVICE_NAME="crisislink-frontend"

gcloud run deploy $SERVICE_NAME \
  --project=$GOOGLE_CLOUD_PROJECT \
  --region=$GOOGLE_CLOUD_LOCATION \
  --source="." \
  --allow-unauthenticated \
  --clear-base-image


Step 8: You're Done!

Your crisislink-frontend service URL is now live. Open it in a browser to use your application.

💡 Example Prompts to Test

(Emergency): "There's a fire in Mumbai, I need the fire helpline and the nearest hospital!"

(Volunteer): "I'm in Bangalore and want to donate blood. Where can I go?"

(Safety): "What should I do in an earthquake?"

(Mental Health): "I'm feeling really overwhelmed and need to talk to someone. I don't know what to do."