import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import productRoute from "./handlers/productHandler";
import userRoute from "./handlers/userHandler";
import orderRoute from "./handlers/orderHandler";

export const app: express.Application = express();
const address = "0.0.0.0:3000";

app.use(cors());
app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Hello World!");
  console.log(req.body);
});

productRoute(app);
userRoute(app);
orderRoute(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});
