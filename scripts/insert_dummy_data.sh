#!/bin/bash

# Replace these values with your actual token and username
TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlhhelozMndFeWJWOV9vZ2VudHNkZyJ9.eyJ1c2VyX2VtYWlsIjoidGVzdEBsYXJjb20uZGV2IiwiaXNzIjoiaHR0cHM6Ly9kZXYtamw0YnJxanV2YmtibTQ3ci51cy5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NjgwZDJlYjU3NzliYjZlODQ3N2NiZDAzIiwiYXVkIjpbImh0dHBzOi8vdHJhY2tlci5sYXJjb20uZGV2IiwiaHR0cHM6Ly9kZXYtamw0YnJxanV2YmtibTQ3ci51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzQ1Njk3MzQ2LCJleHAiOjE3NDU3ODM3NDYsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhenAiOiJyR3pnc2lSUDB6T3lxa0picmVBN2lrMjVBSWVlc2ZQQyJ9.Sh4UfjC2Tbrr6RrRBBYWzBgGaeZjrmcxL0dCL8ILP0J-HHSdxhLvMPfowDmkYvBHoqOrnCnUCL6LqOCJ1tbUZSmgPdxljLMXPZJUwELo_CScDcdiUVgrwhs9eBRiSc6q3y9KUBYej8Vl9f6LD2_vKsmI0e3EG8UHiAGC6I-hj_7uNOKK9dhGf0RFg2jQqo8gNI9yU-vUstg42-O3F9P0loefEx1i7KbQtF9ka6pfeS6SPVNpt4-9pjtqGRqtluvQTaguGc-9jTaeCH3q5yfKpv-po9vMB7qdQvkYWUFRWwJlgVcR05AfBOOOgL3KGQodeDUUawGmYtQtWyVCoNvJEA"
USERNAME="test@larcom.dev"

# Function to insert an application
insert_application() {
    local company="$1"
    local title="$2"
    local status="$3"
    local location="$4"
    local link="$5"
    local skills="$6"
    local date="$7"

    curl -X POST "http://localhost:8080/apps/${USERNAME}" \
        -H "Authorization: Bearer ${TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{
            \"company\": \"${company}\",
            \"title\": \"${title}\",
            \"status\": \"${status}\",
            \"location\": \"${location}\",
            \"link\": \"${link}\",
            \"skills\": ${skills},
            \"application_date\": \"${date}\"
        }"
    echo
}

echo "Starting to insert dummy data..."

# Google
insert_application \
    "Google" \
    "Senior Software Engineer" \
    "Applied" \
    "Mountain View, CA" \
    "https://careers.google.com" \
    "[\"Python\", \"Go\", \"Kubernetes\", \"Machine Learning\"]" \
    "2024-03-15T00:00:00.000Z"

# Microsoft
insert_application \
    "Microsoft" \
    "Full Stack Developer" \
    "Interviewing" \
    "Redmond, WA" \
    "https://careers.microsoft.com" \
    "[\"React\", \"Node.js\", \"TypeScript\", \"Azure\"]" \
    "2024-03-01T00:00:00.000Z"

# Amazon
insert_application \
    "Amazon" \
    "Software Development Engineer II" \
    "Rejected" \
    "Seattle, WA" \
    "https://amazon.jobs" \
    "[\"Java\", \"AWS\", \"System Design\", \"Distributed Systems\"]" \
    "2024-02-20T00:00:00.000Z"

# Apple
insert_application \
    "Apple" \
    "iOS Developer" \
    "Offered" \
    "Cupertino, CA" \
    "https://apple.com/careers" \
    "[\"Swift\", \"SwiftUI\", \"iOS\", \"XCode\"]" \
    "2024-02-10T00:00:00.000Z"

# Meta
insert_application \
    "Meta" \
    "Frontend Engineer" \
    "Applied" \
    "Menlo Park, CA" \
    "https://metacareers.com" \
    "[\"React\", \"JavaScript\", \"GraphQL\", \"CSS\"]" \
    "2024-01-25T00:00:00.000Z"

# Netflix
insert_application \
    "Netflix" \
    "Senior Backend Engineer" \
    "Interviewing" \
    "Los Gatos, CA" \
    "https://jobs.netflix.com" \
    "[\"Java\", \"Spring Boot\", \"Microservices\", \"Kafka\"]" \
    "2024-01-15T00:00:00.000Z"

echo "Finished inserting dummy data" 