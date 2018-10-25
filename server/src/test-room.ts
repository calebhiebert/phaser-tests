import { Room, Client, Presence } from 'colyseus';
import { Logger } from 'pino';
import createLogger from './create-logger';

export class TestRoom extends Room {
  private logger: Logger;

  constructor(presence?: Presence) {
    super(presence);
    this.logger = createLogger('test-room');

    this.setState({
      hello: 'world',
      timer: 0,
    });

    setInterval(() => {
      this.state.timer++;
    }, 1000);
  }

  onMessage(client: Client, data: any): void {
    this.logger.info('CLIENT MSG', client, data);
  }
}
