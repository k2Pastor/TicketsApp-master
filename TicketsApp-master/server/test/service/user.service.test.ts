import {clearDatabase, closeDatabase, connect} from "../db.setup";
import {RegistrationModel} from "../../src/service/user.service";
import {UserService} from "../../src/service/user.service";
jest.setTimeout(40000);

const registrationModel: RegistrationModel = {
    email: "a@a.com",
    password: "1",
    firstName: "Test First Name",
    lastName: "Last Name",
    phone: 123123
};

beforeAll(async () => { await connect() });

afterEach(async () => { await clearDatabase() });

afterAll(async () => { await closeDatabase() });

describe("UserService Test", () => {
    it("Should validate parameters", async () => {
        const service = new UserService();
        expect.assertions(2);
        jest.spyOn(service, "createUser");

        let clone = Object.assign({}, registrationModel);
        clone.email = null;
        await expect(service.createUser(clone)).rejects.toEqual("email is required");

        clone = Object.assign({}, registrationModel);
        clone.password = null;
        await expect(service.createUser(clone)).rejects.toEqual("password is required");
    });

    it("Should register user", async () => {
        const service = new UserService();
        expect.assertions(2);
        jest.spyOn(service, "createUser");


        const credentials = await service.createUser(registrationModel);
        expect(credentials.firstName).toEqual(registrationModel.firstName);
        expect(credentials.role).toEqual("User");
    });

    it("Should return user", async () => {
        const service = new UserService();
        expect.assertions(4);
        jest.spyOn(service, "getUser");


        const credentials = await service.createUser(registrationModel);
        const createdUser = await service.getUser(credentials._id);

        expect(createdUser.phone).toEqual(registrationModel.phone);
        expect(createdUser.firstName).toEqual(registrationModel.firstName);
        expect(createdUser.lastName).toEqual(registrationModel.lastName);
        expect(createdUser.email).toEqual(registrationModel.email);
    });

    it("Should return all users", async () => {
        const service = new UserService();
        expect.assertions(1);
        jest.spyOn(service, "getAll");


        await service.createUser(registrationModel);
        await service.createUser(registrationModel);

        const allUsers = await service.getAll();
        expect(allUsers.length).toEqual(2);
    });
});
