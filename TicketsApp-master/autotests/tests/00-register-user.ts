import {repeatTest} from "../src/constants/constants";
import {RegisterUserScenario} from "../src/scenarios/register-user";

fixture("pavo-shared-services-frontend").before(async ctx => {
    ctx.url="http://localhost:3000/login"
}).beforeEach(async t => {
    await t
        .navigateTo(`${ t.fixtureCtx.url }`);
});

repeatTest("Register User", RegisterUserScenario.registerUser)
