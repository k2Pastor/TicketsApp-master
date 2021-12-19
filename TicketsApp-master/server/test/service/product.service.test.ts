import {ProductService} from "../../src/service/product.service";
import {ProductModel} from "@pavo/shared-services-shared/src";
import {clearDatabase, closeDatabase, connect} from "../db.setup";
jest.setTimeout(40000);

beforeAll(async () => { await connect() });

afterEach(async () => { await clearDatabase() });

afterAll(async () => { await closeDatabase() });

const product: ProductModel = {
    title: "title MONGOOSE",
    description: "description",
    price: 123,
    participantsAmount: 1,
};

describe("ProductService Test", () => {
    it("Should validate product parameters", async () => {
        const service = new ProductService();
        jest.spyOn(service, "addProduct");
        expect.assertions(4);

        let p1 = Object.assign({}, product);
        p1.title = null;
        await expect(service.addProduct(p1)).rejects.toEqual("title is required");

        p1 = Object.assign({}, product);
        p1.description = null;
        await expect(service.addProduct(p1)).rejects.toEqual("description is required");

        p1 = Object.assign({}, product);
        p1.price = null;
        await expect(service.addProduct(p1)).rejects.toEqual("price is required");

        p1 = Object.assign({}, product);
        p1.participantsAmount = null;
        await expect(service.addProduct(p1)).rejects.toEqual("participants amount is required");
    });

    it("Should create product", async () => {
        const service = new ProductService();
        expect.assertions(1);
        jest.spyOn(service, "addProduct");

        let p1 = Object.assign({}, product);
        await expect(service.addProduct(product)).resolves.toMatchObject(p1);
    });

    it("Should return created product", async () => {
        const service = new ProductService();
        expect.assertions(2);
        jest.spyOn(service, "getAll");

        let p1 = Object.assign({}, product);
        await expect(service.addProduct(product)).resolves.toMatchObject(p1);

        const products = await service.getAll();
        expect(products[0]).toEqual(expect.objectContaining(product));
    });
})
