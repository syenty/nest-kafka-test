import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'worker-consumer',
        brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
      },
      consumer: {
        groupId: process.env.KAFKA_CONSUMER_GROUP || 'worker-group',
      },
    },
  });

  await app.listen();
  console.log('Worker listening for Kafka messages');
}

bootstrap();
