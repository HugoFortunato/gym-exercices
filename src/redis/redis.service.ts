import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient } from 'redis';

// Tipo do cliente Redis
type RedisClient = ReturnType<typeof createClient>;

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  // Cliente Redis que será inicializado
  private client!: RedisClient;

  async onModuleInit() {
    try {
      // Criar conexão com Redis
      this.client = createClient({
        socket: {
          host: 'localhost',
          port: 6379,
        },
      });

      // Listener para erro
      this.client.on('error', (err) => {
        console.error('❌ Erro no Redis:', err);
      });

      // Conectar ao Redis
      await this.client.connect();
      console.log('✅ Conectado ao Redis com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao conectar ao Redis:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    // Desconectar do Redis ao destruir o módulo
    if (this.client) {
      try {
        await this.client.disconnect();
        console.log('🔌 Desconectado do Redis');
      } catch (error) {
        console.error('❌ Erro ao desconectar do Redis:', error);
      }
    }
  }

  /**
   * MÉTODO GET - Busca valor do cache
   * @param key - Chave do cache
   * @returns Valor armazenado ou null
   */
  async get(key: string): Promise<string | null> {
    try {
      const value = await this.client.get(key);
      if (value) {
        console.log(`💾 Cache HIT para chave: ${key}`);
      } else {
        console.log(`❌ Cache MISS para chave: ${key}`);
      }
      return value;
    } catch (error) {
      console.error('Erro ao buscar do Redis:', error);
      return null;
    }
  }

  /**
   * MÉTODO SET - Armazena valor no cache
   * @param key - Chave do cache
   * @param value - Valor a armazenar (como string)
   * @param expiresIn - Tempo de expiração em segundos (opcional)
   */
  async set(key: string, value: string, expiresIn?: number): Promise<void> {
    try {
      if (expiresIn) {
        // Se tiver tempo de expiração, usar a opção EX
        await this.client.set(key, value, { EX: expiresIn });
        console.log(
          `💾 Cache SET para chave: ${key} (expira em ${expiresIn}s)`,
        );
      } else {
        // Sem expiração
        await this.client.set(key, value);
        console.log(`💾 Cache SET para chave: ${key}`);
      }
    } catch (error) {
      console.error('Erro ao salvar no Redis:', error);
    }
  }

  /**
   * MÉTODO DEL - Deleta chave do cache
   * @param key - Chave a deletar
   */
  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
      console.log(`🗑️  Cache DELETE para chave: ${key}`);
    } catch (error) {
      console.error('Erro ao deletar do Redis:', error);
    }
  }

  /**
   * MÉTODO FLUSH - Limpa todo o cache
   */
  async flushAll(): Promise<void> {
    try {
      await this.client.flushAll();
      console.log('🗑️  Todos os caches foram removidos');
    } catch (error) {
      console.error('Erro ao limpar Redis:', error);
    }
  }
}
