import {Selector} from "testcafe";
import {v4} from "uuid";
import {HTTP_TIMEOUT} from "../constants/constants";
import {CreateOrderScenario} from "./create-order";
import * as userData from "../data/user-data.json";
import {NavigationPanel} from "../page-models/navigation-panel";
import {LoginPage} from "../page-models/login";

export class ParticipateInOrderScenario {
    static readonly participateButtonSelector = Selector("#participateButton");
    static readonly leaveButtonSelector = Selector("#leaveButton")
    static readonly participantsListSelector = Selector(".order-details__participant")


    static async participateInOrder(t: TestController, title?: string) {
        const name = title || "Title " + v4();
        await CreateOrderScenario.createOrder(t, name);
        await NavigationPanel.navigateToButton("Sign Out");
        await LoginPage.authUser();
        await NavigationPanel.navigateToTab("All Orders");
        await t
            .click(CreateOrderScenario.orderCardTitle.withText(name)
                .parent().find(".ant-card-extra a"))
            .wait(HTTP_TIMEOUT);
        await t
            .expect(ParticipateInOrderScenario.participateButtonSelector.exists)
            .ok();
        await t
            .click(ParticipateInOrderScenario.participateButtonSelector)
            .wait(HTTP_TIMEOUT)
            .expect(ParticipateInOrderScenario.leaveButtonSelector.exists)
            .ok();
        await t
            .expect(ParticipateInOrderScenario.participantsListSelector.withText(userData.user.firstName + " " + userData.user.lastName).exists)
            .ok()
    }
}
