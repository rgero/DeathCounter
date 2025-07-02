import { Request, Response, Router } from 'express';

import { getGameToken } from '../services/apiDeathCounter';

const router: Router = Router();

router.get('/get_game_token', async (req: Request, res: Response): Promise<any> => {

  const { userId, authToken, gameName } = req.body;

  if (!userId || !authToken || !gameName) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const gameToken = await getGameToken(authToken, userId, gameName);

  return res.json({ gameToken });
});

router.get('/regenerate_game_token', async (req: Request, res: Response): Promise<any> => {
  // I want this endpoint to regenerate a game token.
  // It should take the user id, the old id, and the auth token.
  const { userId, oldId, authToken } = req.body;

  // Validate the input
  if (!userId || !oldId || !authToken) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }


  // TODO: Implement the logic to regenerate the game token
  return res.json({ message: 'This is a placeholder for the regenerate game token endpoint.' });
});

export default router;
