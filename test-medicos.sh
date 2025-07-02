#!/bin/bash

echo "🧪 Testing MediLogs2 Médicos API - PostgreSQL"
echo "=============================================="

BASE_URL="http://localhost:3002"

# Test 1: Health check
echo "1️⃣ Testing health check..."
curl -s $BASE_URL/health | jq '.'
echo ""

# Test 2: Get all médicos (should be empty initially)
echo "2️⃣ Testing GET /api/medicos..."
curl -s $BASE_URL/api/medicos | jq '.'
echo ""

# Test 3: Create a new médico
echo "3️⃣ Testing POST /api/medicos..."
MEDICO_DATA='{
  "nombre": "Dr. Juan Pérez",
  "email": "juan.perez@hospital.com",
  "password": "password123"
}'

MEDICO_RESPONSE=$(curl -s -X POST $BASE_URL/api/medicos \
  -H "Content-Type: application/json" \
  -d "$MEDICO_DATA")

echo "$MEDICO_RESPONSE" | jq '.'

# Extract médico ID for further tests
MEDICO_ID=$(echo "$MEDICO_RESPONSE" | jq -r '.data.id')
echo "Médico ID: $MEDICO_ID"
echo ""

# Test 4: Get all médicos (should now have one)
echo "4️⃣ Testing GET /api/medicos after creation..."
curl -s $BASE_URL/api/medicos | jq '.'
echo ""

# Test 5: Get specific médico by ID
echo "5️⃣ Testing GET /api/medicos/$MEDICO_ID..."
curl -s $BASE_URL/api/medicos/$MEDICO_ID | jq '.'
echo ""

# Test 6: Update médico
echo "6️⃣ Testing PUT /api/medicos/$MEDICO_ID..."
UPDATE_DATA='{
  "nombre": "Dr. Juan Carlos Pérez",
  "email": "juan.carlos.perez@hospital.com"
}'

curl -s -X PUT $BASE_URL/api/medicos/$MEDICO_ID \
  -H "Content-Type: application/json" \
  -d "$UPDATE_DATA" | jq '.'
echo ""

# Test 7: Test login
echo "7️⃣ Testing POST /api/auth/login..."
LOGIN_DATA='{
  "email": "juan.carlos.perez@hospital.com",
  "password": "password123"
}'

curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "$LOGIN_DATA" | jq '.'
echo ""

# Test 8: Test invalid login
echo "8️⃣ Testing POST /api/auth/login with wrong password..."
WRONG_LOGIN='{
  "email": "juan.carlos.perez@hospital.com",
  "password": "wrongpassword"
}'

curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "$WRONG_LOGIN" | jq '.'
echo ""

# Test 9: Create another médico for testing duplicate email
echo "9️⃣ Testing duplicate email validation..."
DUPLICATE_EMAIL='{
  "nombre": "Dr. María García",
  "email": "juan.carlos.perez@hospital.com",
  "password": "password456"
}'

curl -s -X POST $BASE_URL/api/medicos \
  -H "Content-Type: application/json" \
  -d "$DUPLICATE_EMAIL" | jq '.'
echo ""

echo "✅ Médicos API testing completed!"
echo "Note: The médico with ID $MEDICO_ID was created and modified during testing."
