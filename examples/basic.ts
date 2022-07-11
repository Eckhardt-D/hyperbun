import {createServer} from '../src/index.js';

const server = createServer();

server.middleware((request, context) => {
  console.log('Just a simple middleware...');
});

server.middleware(() => {
  return new Response('Custom middleware early return', {
    status: 200,
  })
});

server.middleware(() => {
  return new Error('Oops, I returned a 500. (Will not run because previous returned Response)')
});

server.middleware(() => {
  console.log('I will not run, because the previous ones returned early.')
})

server.get('/', async (request, context) => {
  return {
    hello: 'World!',
  };
});


server.post('/add', async (request) => {
  return await request.json() // body as JSON reflected back
})

server.listen({
  port: 3000,
  hostname: '0.0.0.0',
});
