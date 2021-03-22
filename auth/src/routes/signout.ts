import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (_req, res) => {
  res.json({ me: "signout" });
})

export { router as signoutRouter };