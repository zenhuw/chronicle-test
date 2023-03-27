import 'dotenv/config';
import compression from 'compression';
import config from 'config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { initRoutes } from './routes';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';

const app = express();

const limiter = rateLimit({
  windowMs: config.get('rateLimit.windowMs'),
  max: config.get('rateLimit.max'),
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(compression());

app.use(cors({ origin: config.get('cors.origin'), credentials: config.get('cors.credentials') }));

app.use(cookieParser());

initRoutes(app);

const port: number = config.get('port') || 3000;

export const server = app.listen(port, '0.0.0.0', () => {
  console.log(`App is running at http://localhost:${port} in %s mode`, app.get('env'));
});
