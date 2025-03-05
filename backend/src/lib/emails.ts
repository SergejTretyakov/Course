import { promises as fs } from 'fs';
import path from 'path';
import { type Pin, type User } from '@prisma/client';
import fg from 'fast-glob';
import _ from 'lodash';
import { env } from './env';
import Handlebars from 'handlebars';
import { sendEmailThroughBrevo } from './brevo';
import {getCreatePinRoute} from '@projects/webapp/src/lib/routes';
import { logger } from './logger';

const getHbrTemplates = _.memoize(async () => {
  const htmlPathsPattern = path.resolve(__dirname, '../emails/dist/**/*.html');
  const htmlPaths = fg.sync(htmlPathsPattern);
  const hbrTemplates: Record<string, HandlebarsTemplateDelegate> = {};
  for (const htmlPath of htmlPaths) {
    const templateName = path.basename(htmlPath, '.html');
    const htmlTemplate = await fs.readFile(htmlPath, 'utf8');
    hbrTemplates[templateName] = Handlebars.compile(htmlTemplate);
  }
  return hbrTemplates;
});

const getEmailHtmlTemplate = async (templateName: string, templateVariables: Record<string, string> = {}) => {
  const hbrTemplates = await getHbrTemplates();
  const hbrTemplate = hbrTemplates[templateName];
  const html = hbrTemplate(templateVariables);
  return html;
};

const sendEmail = async ({
  to,
  subject,
  templateName,
  templateVariables = {},
}: {
  to: string;
  subject: string;
  templateName: string;
  templateVariables?: Record<string, any>;
}) => {
  try {
    const fullTemplateVaraibles = {
      ...templateVariables,
      homeUrl: env.WEBAPP_URL,
    };
    const html = await getEmailHtmlTemplate(templateName, fullTemplateVaraibles);
    const { loggableResponse } = await sendEmailThroughBrevo({ to, html, subject });
    logger.info('email', 'sendEmail', {
      to,
      templateName,
      fullTemplateVaraibles,
      templateVariables,
      response: loggableResponse,
    });
    return { ok: true };
  } catch (error) {
    logger.error('email', error, {
      to,
      templateName,
      templateVariables,
    })
    return { ok: false };
  }
};

export const sendWelcomeEmail = async ({ user }: { user: Pick<User, 'nick' | 'email'> }) => {
  return await sendEmail({
    to: user.email,
    subject: 'Спасибо за регистрацию!',
    templateName: 'welcome',
    templateVariables: {
      userNick: user.nick,
      addIdeaUrl: `${getCreatePinRoute({abs: true})}`,
    },
  });
};

export const sendPinBlockedEmail = async ({ user, pin }: { user: Pick<User, 'email'>; pin: Pick<Pin, 'title'> }) => {
  return await sendEmail({
    to: user.email,
    subject: 'Ваш пин заблокирован!',
    templateName: 'pinBlocked',
    templateVariables: {
      pinID: pin.title,
    },
  });
};
