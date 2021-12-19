import {LoginPage} from "../page-models/login";
import {v4} from "uuid";
import {NavigationPanel} from "../page-models/navigation-panel";
import {Selector} from "testcafe";
import {HTTP_TIMEOUT} from "../constants/constants";

export class CreateProductScenario {
    static readonly productTitleInput = Selector("#newProductTitleInput");
    static readonly productDescriptionInput = Selector("#newProductDescriptionInput");
    static readonly productPriceInput = Selector("#newProductPriceInput");
    static readonly productParticipantsInput = Selector("#newProductParticipantsInput");
    static readonly productSubmitButton = Selector("#newProductSubmit");
    static readonly productCardTitle = Selector(".products-page-cards-container .ant-card-head-title")

    static async createProduct(t: TestController, title?: string) {
        const name = title || "Title " + v4();
        await LoginPage.authAdmin();
        await NavigationPanel.navigateToTab("All Products");
        await t
            .click(Selector("#newProductButton"))
            .expect(CreateProductScenario.productTitleInput.exists).ok();
        await CreateProductScenario.fillCreationForm(t, name);
        await t
            .click(CreateProductScenario.productSubmitButton)
            .wait(HTTP_TIMEOUT)
            .expect(CreateProductScenario.productCardTitle.withText(name).exists).ok();
    }

    static async fillCreationForm(t: TestController, name: string) {
        await t
            .typeText(CreateProductScenario.productTitleInput, name)
            .typeText(CreateProductScenario.productDescriptionInput, "Test Description")
            .typeText(CreateProductScenario.productParticipantsInput, "1")
            .typeText(CreateProductScenario.productPriceInput, "1000")
    }
}
