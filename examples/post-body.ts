import { createServer } from "../dist";

const server = createServer();


server.middleware(async (request, context) => {
  console.log(context);
  await request.json().then(console.log);
})

server.post('/', async (request, context) => {
  console.log(await request.json()); // empty for now because it was consumed already.
  return {success: "true"}
})

server.listen({
  port: 3000,
  hostname: '0.0.0.0',
});