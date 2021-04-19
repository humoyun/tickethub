import express from 'express';

const router = express.Router();

router.post('/api/tickets/some', (req, res) => {
  req.session = null;
  res.json([]);
})

export { router as someRouter };