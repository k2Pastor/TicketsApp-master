import {RegistrationPage} from "../page-models/registration";
import {HTTP_TIMEOUT} from "../constants/constants";
import {NavigationPanel} from "../page-models/navigation-panel";

export class RegisterUserScenario {
    static async registerUser(t: TestController) {
        await NavigationPanel.navigateToButton("Sign Up");
        await RegistrationPage.register();
        await t
            .wait(HTTP_TIMEOUT)
            .expect(NavigationPanel.navigationItems.withText("All Orders").exists)
            .ok();
    }
}
