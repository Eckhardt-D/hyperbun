# HyperBun is meant for Bun runtimes, it will not work in Node / Deno.

A simple HTTP routing library built on top of Bun's built in HTTP solution.

## Getting started

    bun add hyperbun

## Example

```ts
import {createServer} from 'hyperbun';

const server = createServer();

server.middleware((request, context) => {
  console.log('Just a simple middleware...');
});

server.middleware((request, context) => {
  return Error('Oops, I returned a 500.');
});

server.get('/json', (request, context) => {
  return {
    hello: 'I will automatically become a JSON response...'
  }
});

server.get('/text', (request, context) => {
  return "Hello, I will be a text/html response...";
});

server.listen({
  port: 3000,
  hostname: '0.0.0.0'
});
```

> Note, if you consume the request body in your middlewares they will currently be empty in the route handler.

## Request Context

Includes `{params: {}, query: {}}` by default. More to come.

```ts
import {createServer} from 'hyperbun'

const server = createServer();

server.middleware((request, context) => {
  context.auth = {user: '1234'};
});

// /home?search=movies
server.get('/home', (_, context) => {
  console.log(context.query) // { search: "movies" }
  return 'OK';
})

server.get('/private', (_, context) => {
  if (context.auth?.user !== '1234') {
    // Return your own custom responses too.
    return new Response('unauthorized', {
      status: 401,
    })
  }

  return {
    private: 'data',
  }
})

server.listen({port: 3000});

```

## Send a file response

```ts
import {createServer, asAttachment} from 'hyperbun';

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

```

## Consuming a request body

```ts
import {createServer} from 'hyperbun'

const server = createServer();

server.post('/users/add', async (request, context) => {
  const user = await request.json();
  const result = await database.create(user);
  return result;
});
```

## Not nearly ready yet..

You can probably use it for the most basic HTTP server, but there are maaaany things missing and in progress. So probably don't.

## Available methods

These listeners will automatically match the route and method that you setup and respond with a 404 for ones you don't have.

`server.get`
`server.post`
`server.put`
`server.delete`
`server.patch`