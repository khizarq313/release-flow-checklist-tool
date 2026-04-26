import './env';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { json } from 'body-parser';
import { ensureDatabaseIsReady } from './ensureDatabaseIsReady';

const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : true
}));
app.use(json());

app.get('/', (req, res) => {
  res.send('Release Flow API is running. GraphQL endpoint is at /graphql');
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

async function startServer() {
  ensureDatabaseIsReady();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true, // Enable for debugging in production
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Log query name if available for debugging
        if (req.body?.operationName) {
          console.log(`[GraphQL] ${req.body.operationName}`);
        }
        return {};
      },
    })
  );

  app.listen(port, () => {
    console.log(`Server ready at http://localhost:${port}/graphql`);
  });
}

startServer().catch(err => console.error(err));
