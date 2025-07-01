import { Request, Response, Router } from 'express';

const router = Router();

router.get('/get_game_token', (req: Request, res: Response) => {
  res.json({ message: 'This is a placeholder for the game token endpoint.' });
});

router.get('/regenerate_game_token', (req: Request, res: Response) => {
  res.json({ message: 'This is a placeholder for the regenerate game token endpoint.' });
});

export default router;
