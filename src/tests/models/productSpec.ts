import { FullProduct, Product, ProductStore } from "../../models/product";

const ps = new ProductStore();

describe("Product Model", () => {
  const product: Product = {
    product_name: "CodeMaster 3000",
    price: 2000,
  };

  async function createProduct(product: Product) {
    return ps.create(product);
  }

  async function deleteProduct(id: number) {
    return ps.delete(id);
  }

  it("It should have an index method", () => {
    expect(ps.index).toBeDefined();
  });

  it("It should have a show method", () => {
    expect(ps.show).toBeDefined();
  });

  it("It should have a add method", () => {
    expect(ps.create).toBeDefined();
  });

  it("add method should add a product", async () => {
    const createdProduct: FullProduct = await createProduct(product);

    expect(createdProduct).toEqual({
      id: createdProduct.id,
      product_name: product.product_name,
      price: product.price,
    });

    await deleteProduct(createdProduct.id);
  });

  it("index method should return a list of products", async () => {
    const createdProduct: FullProduct = await createProduct(product);
    const productList = await ps.index();

    expect(productList).toEqual([createdProduct]);

    await deleteProduct(createdProduct.id);
  });

  it("show method should return the correct product", async () => {
    const createdProduct: FullProduct = await createProduct(product);
    const productFromDb = await ps.show(createdProduct.id);

    expect(productFromDb).toEqual(createdProduct);

    await deleteProduct(createdProduct.id);
  });
});
