import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';

import appConfig from './configuarations/appConfig';

import userRoutes from './handlers/userHandler';
import orderRoutes from './handlers/orderHandler';
import productRoutes from './handlers/productHandler';

const PORT = appConfig.port || 3000;

const app: Application = express();
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello World!'
  });
});

userRoutes(app);
productRoutes(app);
orderRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is starting at port: ${PORT}`);
});

export default app;
