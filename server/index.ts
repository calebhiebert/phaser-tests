import { Server } from 'colyseus';
import http from 'http';
import createLogger from './src/create-logger';

const logger = createLogger('index');

const gameServer = new Server({
  server: http.createServer(),
});

logger.info('Created game server');

gameServer.listen(2567, '0.0.0.0', 1, () => {
  logger.info('SERVER LISTENING', {
    port: 2567,
    hostname: '0.0.0.0',
  });
});
