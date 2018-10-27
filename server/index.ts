import { Server } from 'colyseus';
import http from 'http';
import createLogger from './src/create-logger';
import { GameRoom } from './src/game-room';

const port = process.env.PORT || 2657;
const hostname = process.env.HOSTNAME || '0.0.0.0';
const logger = createLogger('index');

const gameServer = new Server({
	server: http.createServer(),
});

logger.info('Created game server');

gameServer.listen(port as number, hostname, 1, () => {
	logger.info('SERVER LISTENING', {
		port,
		hostname,
	});
});

gameServer.register('game', GameRoom);
