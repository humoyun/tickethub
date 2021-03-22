import express from 'express';
import cors from 'cors';
import {
  currentUserRouter,
  signoutRouter,
  signinRouter,
  signupRouter
} from './routes';

const app = express();

app.use(cors())
app.use(express.json())
app.disable('x-powered-by');

const PORT = 4001;

app.use(currentUserRouter)
app.use(signoutRouter)
app.use(signinRouter)
app.use(signupRouter)

/**
 * events
 */
 app.post('/events', (req, res) => {
  console.log('auth service events path', req.body)
  res.json({msg: "ok"}).status(200)
});


app.listen(PORT, () => {
  console.log(`auth service started on ${PORT}!`)
})