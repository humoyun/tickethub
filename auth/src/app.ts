import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import {
  currentUserRouter,
  signoutRouter,
  signinRouter,
  signupRouter
} from './routes';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors'
import mongoose from 'mongoose';

const app = express();

app.use(cors())
app.use(express.json())
app.disable('x-powered-by');

const PORT = 4001;

app.use(currentUserRouter);
app.use(signoutRouter);
app.use(signinRouter);
app.use(signupRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

/**
 * events
 */
 app.post('/events', (req, res) => {
  console.log('auth service events path', req.body)
  res.json({msg: "ok"}).status(200)
});

const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('*** auth connected to mongodb ***')
  } catch (err) {
    console.error('mongodb conn err: ', err)  
  }
  
  app.listen(PORT, () => {
    console.log(`auth service started on ${PORT}!`)
  })
}

start()
