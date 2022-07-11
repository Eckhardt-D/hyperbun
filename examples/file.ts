import {createServer, asAttachment} from '../dist';

const server = createServer();

server.get('/file-inline',  () => {
  return Bun.file('./test-file.txt'); // Inline
})

server.get('/file-download',  () => {
  return asAttachment('./test-file.txt', { // Attachment (download)
    name: 'helloworld.txt'
  });
})

server.listen({
  port: 3000,
  hostname: '0.0.0.0',
});
