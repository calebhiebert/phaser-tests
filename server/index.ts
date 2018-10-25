import { Server } from 'colyseus';
import http from 'http';
import createLogger from './src/create-logger';
import { TestRoom } from './src/test-room';

const logger = createLogger('index');

const gameServer = new Server({
  server: http.createServer(),
});

logger.info('Created game server');

gameServer.listen(2657, '0.0.0.0', 1, () => {
  logger.info('SERVER LISTENING', {
    port: 2657,
    hostname: '0.0.0.0',
  });
});

gameServer.register('room', TestRoom);
