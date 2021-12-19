import {repeatTest} from "../../src/constants/constants";
import {ParticipateInOrderScenario} from "../../src/scenarios/participate-in-order";

fixture("pavo-shared-services-frontend").before(async ctx => {
    ctx.url="http://localhost:3000/login"
}).beforeEach(async t => {
    await t
        .navigateTo(`${ t.fixtureCtx.url }`);
});

repeatTest("Participate in Order", ParticipateInOrderScenario.participateInOrder)
