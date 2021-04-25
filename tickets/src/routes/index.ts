import express, { Request, Response } from 'express'

const router = express.Router();

router.post('/api/tickets/some', (req: Request, res: Response) => { 
  req.session = null;
  res.json([]);
})

export { router as someRouter };