import { createServer } from "../src/index";

const server = createServer();


server.middleware(async (request) => {
  const buffer = await request.arrayBuffer();
})

server.get('/', async (request) => {
  return 'ok'
})

server.post('/', async (request) => {
  const buffer = await request.arrayBuffer(); // use it again :)
  return new Response(buffer);
})

server.listen({
  port: 3000,
  hostname: '0.0.0.0'
})