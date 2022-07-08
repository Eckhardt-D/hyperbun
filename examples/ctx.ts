import {createServer} from '../src/index';

const server = createServer();

server.middleware((_, context) => {
  context.auth = {username: 'Johnny'};
});

server.middleware((_, context) => {
  console.log(context);
});

server.get('/', async (request) => {
  return {
    url: request.url,
  }
});

server.listen({
  port: 3000,
  hostname: '0.0.0.0',
});