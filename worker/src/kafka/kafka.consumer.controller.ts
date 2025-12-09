import { Controller } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaConsumerService } from './kafka.consumer.service';

const DEFAULT_TOPIC = process.env.KAFKA_TOPIC || 'demo-topic';

@Controller()
export class KafkaConsumerController {
  constructor(private readonly consumerService: KafkaConsumerService) {}

  @MessagePattern(DEFAULT_TOPIC)
  async handleMessage(@Payload() payload: any, @Ctx() context: KafkaContext) {
    const kafkaMessage = context.getMessage();

    await this.consumerService.handleKafkaMessage({
      topic: context.getTopic(),
      key: kafkaMessage.key ? kafkaMessage.key.toString() : null,
      value: payload ?? kafkaMessage.value,
      partition: context.getPartition(),
      offset: kafkaMessage.offset,
      timestamp: kafkaMessage.timestamp,
    });

    return true;
  }
}
