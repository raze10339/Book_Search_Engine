import express from 'express';
import path from 'node:path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { expressMiddleware } from '@apollo/server/express4';
import db from './config/connection.js';
import typeDefs from './schema/typeDefs.js';
import resolvers from './schema/resolvers.js';
import { authenticate } from './services/auth.js';
import { ApolloServer } from '@apollo/server';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
db.once('open', async () => {
    await server.start();
    app.use('/graphql', express.json(), cookieParser(), expressMiddleware(server, {
        context: authenticate
    }));
    console.log('PROCESS PORT VARIABLE', process.env.PORT);
    console.log('PORT VARIABLE');
    if (process.env.PORT) {
        console.log('Triggered');
        const __dirname = path.dirname(new URL(import.meta.url).pathname);
        app.use(express.static(path.join(__dirname, '../../client/dist')));
        app.get('*', (_, res) => {
            res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
        });
    }
    app.listen(PORT, () => console.log(`🌍 Now listening on http://localhost:${PORT}`));
});