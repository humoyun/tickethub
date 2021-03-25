import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import cors from 'cors';
import {
  currentUserRouter, 
  signoutRouter,
  signinRouter,
  signupRouter
} from './routes';
import { errorHandler } from './middlewares/error-handler';
import { RouteNotFoundError } from './errors'


const app = express();

/**
 * By enabling the "trust proxy" setting via app.enable('trust proxy'), Express will have
 * knowledge that it's sitting behind a proxy and that the X-Forwarded-* header
 * fields may be trusted, which otherwise may be easily spoofed.
 * 
 * in our case it is behined ingress-nginx
 */
app.set('trust proxy', true);

app.use(cors())
app.use(cookieSession({
  // we are not encrypting cookie data 'cause we are storing JWT
  signed: false, // and it is already cryptographically signed and temper-poof
  secure: true, // cookie is available only over HTTPS connecion
  name: 'jwt', // changing default name, `express:sess`
}))

app.use(express.json())
app.disable('x-powered-by');

app.use(currentUserRouter);
app.use(signoutRouter);
app.use(signinRouter);
app.use(signupRouter);

app.all('*', async () => {
  throw new RouteNotFoundError();
});

app.use(errorHandler);


/**
 * events
 */
 app.post('/events', (req, res) => {
  console.log('auth service events path', req.body)
  res.json({msg: "ok"}).status(200)
});

export default app;
