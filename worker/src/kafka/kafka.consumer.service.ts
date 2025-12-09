import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../messages/message.entity';

interface KafkaMessagePayload {
  topic: string;
  key: string | null;
  value: unknown;
  partition?: number;
  offset?: string;
  timestamp?: string;
}

@Injectable()
export class KafkaConsumerService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async handleKafkaMessage(payload: KafkaMessagePayload) {
    const normalizedValue = this.normalizeValue(payload.value);
    const messageTimestamp =
      payload.timestamp && !Number.isNaN(Number(payload.timestamp))
        ? new Date(Number(payload.timestamp))
        : null;

    await this.messageRepository.save({
      topic: payload.topic,
      key: payload.key,
      value: normalizedValue,
      partition: payload.partition ?? null,
      offset: payload.offset ?? null,
      messageTimestamp,
    });
  }

  private normalizeValue(value: unknown): Record<string, unknown> {
    if (Buffer.isBuffer(value)) {
      const str = value.toString('utf-8');
      return this.parseJsonSafe(str) ?? { value: str };
    }

    if (typeof value === 'string') {
      return this.parseJsonSafe(value) ?? { value };
    }

    if (value && typeof value === 'object') {
      return value as Record<string, unknown>;
    }

    return { value };
  }

  private parseJsonSafe(raw: string): Record<string, unknown> | null {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
