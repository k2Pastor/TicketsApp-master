import {repeatTest} from "../../src/constants/constants";
import {SubmitOrderScenario} from "../../src/scenarios/submit-order";

fixture("pavo-shared-services-frontend").before(async ctx => {
    ctx.url="http://localhost:3000/login"
}).beforeEach(async t => {
    await t
        .navigateTo(`${ t.fixtureCtx.url }`);
});

repeatTest("Submit Order", SubmitOrderScenario.submitOrder)
