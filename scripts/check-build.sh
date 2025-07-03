#!/bin/bash

echo "🔍 Verificando tipos de TypeScript..."
npx tsc --noEmit

echo "🏗️ Compilando proyecto..."
npx tsc

echo "✅ Verificación completada"
