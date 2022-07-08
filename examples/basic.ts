import {createServer} from 'hyperbun';

const server = createServer();

server.middleware((request, next) => {
  console.log('Just a simple middleware...');
});

server.middleware((request, next) => {
  return next(Error('Oops, I returned a 500.'));
});

server.get('/', (request) => {
  return {
    hello: 'World!'
  }
});

server.listen({
  port: 3000,
  hostname: '0.0.0.0'
});