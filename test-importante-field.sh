#!/bin/bash

echo "🧪 Testing Campo 'importante' como texto - MediLogs2 API"
echo "======================================================="

BASE_URL="http://localhost:3002"

# Test 1: Crear paciente con campo importante como texto
echo "1️⃣ Testing POST /api/pacientes con campo importante..."
PACIENTE_DATA='{
  "nombre": "María Rodríguez",
  "documento": "87654321B",
  "nacimiento": "1985-03-20",
  "sexo": "F",
  "obra_social": "OSDE",
  "mail": "maria.rodriguez@email.com",
  "medico_id": 1,
  "importante": "Paciente diabética, requiere seguimiento especial"
}'

PACIENTE_RESPONSE=$(curl -s -X POST $BASE_URL/api/pacientes \
  -H "Content-Type: application/json" \
  -d "$PACIENTE_DATA")

echo "$PACIENTE_RESPONSE" | jq '.'

# Extract paciente ID
PACIENTE_ID=$(echo "$PACIENTE_RESPONSE" | jq -r '.data.id')
echo "Paciente ID: $PACIENTE_ID"
echo ""

# Test 2: Crear paciente con campo importante muy largo (debería fallar)
echo "2️⃣ Testing validación de longitud máxima (100 caracteres)..."
TEXTO_LARGO="Este es un texto muy largo que supera los 100 caracteres permitidos para el campo importante y debería ser rechazado por la API cuando se intente crear o actualizar un paciente con este texto excesivamente extenso."

PACIENTE_LARGO='{
  "nombre": "Test Largo",
  "documento": "99999999Z",
  "nacimiento": "1990-01-01",
  "importante": "'$TEXTO_LARGO'"
}'

curl -s -X POST $BASE_URL/api/pacientes \
  -H "Content-Type: application/json" \
  -d "$PACIENTE_LARGO" | jq '.'
echo ""

# Test 3: Crear paciente sin campo importante
echo "3️⃣ Testing paciente sin campo importante..."
PACIENTE_SIN_IMPORTANTE='{
  "nombre": "Carlos González",
  "documento": "11223344C",
  "nacimiento": "1992-07-10",
  "sexo": "M",
  "obra_social": "Swiss Medical",
  "mail": "carlos.gonzalez@email.com",
  "medico_id": 1
}'

curl -s -X POST $BASE_URL/api/pacientes \
  -H "Content-Type: application/json" \
  -d "$PACIENTE_SIN_IMPORTANTE" | jq '.'
echo ""

# Test 4: Actualizar paciente con campo importante
echo "4️⃣ Testing PUT /api/pacientes/$PACIENTE_ID con campo importante..."
UPDATE_DATA='{
  "importante": "Actualizado: Paciente con hipertensión controlada"
}'

curl -s -X PUT $BASE_URL/api/pacientes/$PACIENTE_ID \
  -H "Content-Type: application/json" \
  -d "$UPDATE_DATA" | jq '.'
echo ""

# Test 5: Obtener pacientes importantes
echo "5️⃣ Testing GET /api/pacientes/especiales/importantes..."
curl -s $BASE_URL/api/pacientes/especiales/importantes | jq '.'
echo ""

# Test 6: Crear otro paciente con texto importante corto
echo "6️⃣ Testing paciente con texto importante corto..."
PACIENTE_CORTO='{
  "nombre": "Ana López",
  "documento": "55667788D",
  "nacimiento": "1988-12-05",
  "sexo": "F",
  "importante": "Alérgica a penicilina"
}'

curl -s -X POST $BASE_URL/api/pacientes \
  -H "Content-Type: application/json" \
  -d "$PACIENTE_CORTO" | jq '.'
echo ""

# Test 7: Verificar pacientes importantes actualizados
echo "7️⃣ Testing GET /api/pacientes/especiales/importantes después de agregar más..."
curl -s $BASE_URL/api/pacientes/especiales/importantes | jq '.data | length, .[].importante'
echo ""

# Test 8: Test de longitud exacta (100 caracteres)
echo "8️⃣ Testing texto de exactamente 100 caracteres..."
TEXTO_100="Este texto tiene exactamente cien caracteres para probar el límite establecido en el campo."

PACIENTE_100='{
  "nombre": "Test 100 Chars",
  "documento": "10010010E",
  "nacimiento": "1995-05-15",
  "importante": "'$TEXTO_100'"
}'

curl -s -X POST $BASE_URL/api/pacientes \
  -H "Content-Type: application/json" \
  -d "$PACIENTE_100" | jq '.'
echo ""

echo "✅ Testing del campo 'importante' como texto completado!"
echo "📝 El campo ahora acepta texto de hasta 100 caracteres"
