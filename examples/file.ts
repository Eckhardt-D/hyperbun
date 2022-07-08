import {createServer, asAttachment} from '../src/index';

const server = createServer();

server.get('/file', () => {
  return Bun.file('./test-file.txt'); // Inline
})

server.get('/file', () => {
  return asAttachment('./test-file.txt', { // Attachment (download)
    name: 'helloworld.txt'
  });
})

server.listen({
  port: 3000,
  hostname: '0.0.0.0',
});
