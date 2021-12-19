import {Selector} from "testcafe";
import {v4} from "uuid";
import {HTTP_TIMEOUT} from "../constants/constants";
import {CreateOrderScenario} from "./create-order";
import {NavigationPanel} from "../page-models/navigation-panel";
import {LoginPage} from "../page-models/login";
import {ParticipateInOrderScenario} from "./participate-in-order";

export class SubmitOrderScenario {
    static readonly submitButtonSelector = Selector("#submitButton");
    static readonly submitSuccessSelector = Selector(".ant-result-title")


    static async submitOrder(t: TestController, title?: string) {
        const name = title || "Title " + v4();
        await ParticipateInOrderScenario.participateInOrder(t, name);
        await NavigationPanel.navigateToButton("Sign Out");
        await LoginPage.authAdmin();
        await NavigationPanel.navigateToTab("All Orders");
        await t
            .click(CreateOrderScenario.orderCardTitle.withText(name)
                .parent().find(".ant-card-extra a"))
            .wait(HTTP_TIMEOUT);
        await t
            .expect(SubmitOrderScenario.submitButtonSelector.exists)
            .ok();
        await t
            .click(SubmitOrderScenario.submitButtonSelector)
            .wait(HTTP_TIMEOUT)
            .expect(SubmitOrderScenario.submitSuccessSelector.withText("Successfully Submitted Order " + name + " !").exists)
            .ok();
    }
}
