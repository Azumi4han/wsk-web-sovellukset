import cors from 'cors';
import express from 'express';
import api from './api/index.js';
import {errorHandler, notFoundHandler} from './middlewares/error-handlers.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to my REST API!');
});

app.use('/api/v1', api);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
