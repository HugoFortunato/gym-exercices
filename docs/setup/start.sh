#!/bin/bash

echo "🚀 Iniciando Gym Exercices API..."
echo ""

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando!"
    echo "   Por favor, inicie o Docker Desktop e rode este script novamente."
    exit 1
fi

echo "✅ Docker está rodando"
echo ""

# Subir containers
echo "📦 Subindo containers (PostgreSQL + Redis)..."
docker-compose up -d

# Aguardar containers ficarem prontos
echo "⏳ Aguardando containers ficarem prontos..."
sleep 10

# Verificar se containers estão rodando
if docker ps | grep -q "gym_postgres"; then
    echo "✅ PostgreSQL rodando"
else
    echo "❌ PostgreSQL falhou ao iniciar"
    exit 1
fi

if docker ps | grep -q "gym_redis"; then
    echo "✅ Redis rodando"
else
    echo "❌ Redis falhou ao iniciar"
    exit 1
fi

echo ""
echo "🎉 Containers prontos!"
echo ""
echo "📝 Você pode agora rodar:"
echo "   npm run start:dev"
echo ""

