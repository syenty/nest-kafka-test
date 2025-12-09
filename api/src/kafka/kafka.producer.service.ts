import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('KAFKA_PRODUCER') private readonly client: ClientKafka,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  async sendMessage(topic: string, key: string, value: unknown) {
    const normalizedTopic =
      topic || this.configService.get<string>('KAFKA_TOPIC') || 'demo-topic';
    await lastValueFrom(
      this.client.emit(normalizedTopic, {
        key,
        value,
      }),
    );
  }
}
