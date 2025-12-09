# nest-kafka-test

NestJS Kafka 테스트용 베이스 구성입니다. `api` 디렉토리는 Kafka 생산자(API), `worker` 디렉토리는 Kafka 소비자/워커이며 Postgres와 Kafka(KRaft 모드, ZK 없음)를 docker-compose로 올립니다.

## 구성
- `api`: NestJS HTTP API, Kafka 생산자 엔드포인트 `/produce`
- `worker`: NestJS Kafka 소비자, 수신 메시지를 Postgres `messages` 테이블에 저장
- `docker-compose.yml`: kafka(4.1.0, KRaft), postgres, api, worker

## 빠른 시작
```bash
docker-compose up --build
```

서비스가 모두 올라가면 아래와 같이 메시지를 발행합니다.
```bash
curl -X POST http://localhost:3000/produce \
  -H "Content-Type: application/json" \
  -d '{"message":{"hello":"world"}}'
```

기본 토픽은 `demo-topic`이며 워커는 해당 토픽을 구독해 Postgres에 저장합니다. 필요 시 `docker-compose.yml`에서 환경 변수를 수정하세요.
