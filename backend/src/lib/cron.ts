import {CronJob} from 'cron';
import { type AppContext } from './ctx';
import { notifyAboutMostLikedPins } from '../scripts/notifyAboutMostLikedPins';
import { logger } from './logger';

export const applyCron = (ctx: AppContext) => {
    
    new CronJob(
        '0 10 1 * *',
        () => {
            notifyAboutMostLikedPins(ctx).catch((error) => {
                logger.error('cron', error)
            })
        },
        null,
        true
    )
}