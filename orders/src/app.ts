import express from 'express';
import cookieSession from 'cookie-session';
import 'express-async-errors';
import cors from 'cors'; 
import { RouteNotFoundError, errorHandler, currentUser } from 'bay-common';
import {
  getOrderRouter,
  getAllOrdersRouter,
  deleteOrderRouter,
  createOrderRouter,
} from './routes';

const app = express();

/**
 * By enabling the "trust proxy" setting via app.enable('trust proxy'), Express will have
 * knowledge that it's sitting behind a proxy and that the X-Forwarded-* header
 * fields may be trusted, which otherwise may be easily spoofed.
 * 
 * in our case it is behind ingress-nginx
 */
app.set('trust proxy', true);

app.use(cors())
app.use(cookieSession({
  // we are not encrypting cookie data 'cause we are storing JWT
  signed: false, // and it is already cryptographically signed and temper-poof
  secure: process.env.NODE_ENV !== 'test', // cookie is available only over HTTPS connection (jest sets NODE_ENV = test while running tests) 
  name: 'jwt', // changing default name, `express:sess` -> `jwt`
}));

// middleware for getting session info in all handlers
app.use(currentUser)

app.use(express.json())
app.disable('x-powered-by'); // good practice to hide what server is powering this app

app.use(getOrderRouter);
app.use(createOrderRouter);
app.use(getAllOrdersRouter);
app.use(deleteOrderRouter);


app.all('*', async () => {
  throw new RouteNotFoundError();
});

app.use(errorHandler);


/**
 * events
 */
 app.post('/events', (req, res) => {
  console.log('tickets service events path', req.body)
  res.json({ msg: "ok" }).status(200)
});

export default app;
