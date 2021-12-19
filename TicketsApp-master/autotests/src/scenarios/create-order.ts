import {CreateProductScenario} from "./create-product";
import {Selector} from "testcafe";
import {v4} from "uuid";
import {HTTP_TIMEOUT} from "../constants/constants";
import {NavigationPanel} from "../page-models/navigation-panel";

export class CreateOrderScenario {
    static readonly orderCardTitle = Selector(".orders-page-cards-container .ant-card-head-title")

    static async createOrder(t: TestController, title?: string) {
        const name = title || "Title " + v4();
        await CreateProductScenario.createProduct(t, name);
        await t
            .click(CreateProductScenario.productCardTitle.withText(name)
                .parent()
                .parent()
                .parent().find(".create-order-button"))
            .wait(HTTP_TIMEOUT);
        await NavigationPanel.navigateToTab("All Orders");
        await t
            .expect(CreateOrderScenario.orderCardTitle.withText(name).exists)
            .ok();
    }
}
