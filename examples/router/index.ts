import {createServer} from '../../dist';
import {userRouter} from './users';

const server = createServer();

server.use('/', userRouter);

server.listen({
  port: 3000,
  hostname: '0.0.0.0',
})