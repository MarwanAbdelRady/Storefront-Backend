"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../models/product");
const auth_1 = require("../middleware/auth");
const store = new product_1.ProductStore();
const index = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield store.index();
    res.json(products);
});
const show = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield store.show(parseInt(req.params.id));
    res.json(product);
});
// const create = async (_req: Request, res: Response) => {
//   const new_product: FullProduct = {
//     product_name: _req.body.product_name,
//     price: _req.body.price,
//   };
//   try {
//     const newProduct = await store.create(new_product);
//     res.json(newProduct);
//   } catch (err) {
//     res.status(400);
//     res.json(err);
//   }
// };
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product_name = req.body.product_name;
        const price = req.body.price;
        if (product_name === undefined || price === undefined) {
            res.status(400);
            res.send("Some required parameters are missing! eg. :product_name, :price");
            return false;
        }
        const product = yield store.create({ product_name, price });
        res.json(product);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (id === undefined) {
            res.status(400);
            res.send("Missing required parameter :id.");
            return false;
        }
        yield store.delete(id);
        res.send(`FullProduct with id ${id} successfully deleted.`);
    }
    catch (e) {
        res.status(400);
        res.json(e);
    }
});
const productRoute = (app) => {
    app.get("/products", index);
    app.get("/products/:id", show);
    app.post("/products", auth_1.verifyAuthToken, create);
    app.delete("/products/:id", auth_1.verifyAuthToken, deleteProduct);
};
exports.default = productRoute;
