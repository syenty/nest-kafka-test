import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaProducerService } from './kafka/kafka.producer.service';
import { ProduceMessageDto } from './common/dto/produce-message.dto';

@Controller()
export class AppController {
  constructor(
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly configService: ConfigService,
  ) {}

  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Post('produce')
  async produce(@Body() body: ProduceMessageDto) {
    const topic =
      body.topic || this.configService.get<string>('KAFKA_TOPIC') || 'demo-topic';
    const key =
      body.key ||
      `key-${Date.now().toString(16)}-${Math.floor(Math.random() * 1000)}`;

    const payload = body.message ?? body;
    await this.kafkaProducerService.sendMessage(topic, key, payload);

    return { topic, key, status: 'queued' };
  }
}
