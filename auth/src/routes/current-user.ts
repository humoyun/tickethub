import express from 'express';

const router = express.Router();

router.get('/api/users/current-user', (_req, res) => {
  res.json({ me: "current user" });
})

export { router as currentUserRouter };