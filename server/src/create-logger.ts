import pino from 'pino';

export default (name: string) => {
  return pino({ level: process.env.LOG_LEVEL || 'info', name });
};
