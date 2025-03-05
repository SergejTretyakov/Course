import express from 'express';
import cors from 'cors';
import { trpcRouter } from './router';
import { applyTrpcToExpressApp } from './lib/trpc';
import { AppContext, createAppContext } from './lib/ctx';
import { applyPassportToExpressApp } from './lib/passport';
import { env } from './lib/env';
import { presetDb } from './scripts/presetDB';
import { applyCron } from './lib/cron';
import { logger } from './lib/logger';

void (async () => {
  let ctx: AppContext | null = null;
  try {
    ctx = createAppContext();
    await presetDb(ctx);
    const expressApp = express();
    expressApp.use(cors());
    applyPassportToExpressApp(expressApp, ctx);
    await applyTrpcToExpressApp(expressApp, ctx, trpcRouter);
    applyCron(ctx);
    expressApp.use((error: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('express', error);
      if (res.headersSent) {
        next(error)
        return
      }
    })
    expressApp.listen(env.PORT, () => {
      logger.info('express', `listening at http://localhost:${env.PORT}`);
    });
  } catch (error) {
    logger.error('app', error)
    await ctx?.stop();
  }
})();
