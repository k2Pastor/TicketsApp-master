import {repeatTest} from "../../src/constants/constants";
import {CreateProductScenario} from "../../src/scenarios/create-product";

fixture("pavo-shared-services-frontend").before(async ctx => {
    ctx.url="http://localhost:3000/login"
}).beforeEach(async t => {
    await t
        .navigateTo(`${ t.fixtureCtx.url }`);
});

repeatTest("Create Product", CreateProductScenario.createProduct)
