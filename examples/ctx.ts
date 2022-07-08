import {createServer} from '../src/index';

const server = createServer();

server.middleware((request) => {
  request.context.auth = {username: 'Johnny'};
});

server.middleware((request) => {
  console.log(request.context);
});

server.get('/', (request) => {
  return {
    url: request.url,
  }
});

server.listen({
  port: 3000,
  hostname: '0.0.0.0',
});