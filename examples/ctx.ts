import {createServer} from '../src/index';

const server = createServer();

server.middleware((_, context) => {
  context.auth = {username: 'Johnny'};
});

server.middleware((_, context) => {
  console.log(context); // {params: {}, query: {}}
});


server.get('/:id', async (request, context) => {
  const {id} = context.params;

  return {
    hello: 'World! ' + id,
  };
});

// /hello?test=test
server.get('/hello', async (request, context) => {
  console.log(context.query) // {test: "test"}
  return {
    url: request.url,
  }
});

server.listen({
  port: 3000,
  hostname: '0.0.0.0',
});