import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaConsumerController } from './kafka/kafka.consumer.controller';
import { KafkaConsumerService } from './kafka/kafka.consumer.service';
import { Message } from './messages/message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'postgres',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'app',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Message]),
  ],
  controllers: [KafkaConsumerController],
  providers: [KafkaConsumerService],
})
export class AppModule {}
