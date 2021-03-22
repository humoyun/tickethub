import express from 'express';

const router = express.Router();

router.post('/api/users/signin', (_req, res) => {
  res.json({ me: "signin" });
})

export { router as signinRouter };