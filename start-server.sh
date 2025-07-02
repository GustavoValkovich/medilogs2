#!/bin/bash

# Script para liberar puertos y iniciar el servidor
# Uso: ./start-server.sh [puerto]

PORT=${1:-3001}

echo "🔍 Verificando puerto $PORT..."

# Buscar procesos usando el puerto
PID=$(lsof -ti:$PORT)

if [ ! -z "$PID" ]; then
    echo "⚠️  Puerto $PORT está en uso por el proceso $PID"
    echo "🔄 Terminando proceso..."
    kill -9 $PID
    sleep 2
    echo "✅ Proceso terminado"
else
    echo "✅ Puerto $PORT está libre"
fi

echo "🚀 Iniciando servidor en puerto $PORT..."

# Iniciar el servidor con el puerto especificado
PORT=$PORT npm run start:pg
