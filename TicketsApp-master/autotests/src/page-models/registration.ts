import { Selector, t } from "testcafe";
import * as userData from "../data/user-data.json"
import * as authData from "../data/auth.json"

export class RegistrationPage {
    static readonly submitButton = Selector("#registerSubmit");
    static readonly emailField = Selector("#registerEmail");
    static readonly firstNameField = Selector("#registerFirstName");
    static readonly lastNameField = Selector("#registerLastName");
    static readonly phoneField = Selector("#registerPhone");
    static readonly passwordField = Selector("#registerPassword");

    static async register(): Promise<void> {
        await t
            .typeText(RegistrationPage.emailField, authData.credentials.email)
            .typeText(RegistrationPage.firstNameField, userData.user.firstName)
            .typeText(RegistrationPage.lastNameField, userData.user.lastName)
            .typeText(RegistrationPage.phoneField, userData.user.phone)
            .typeText(RegistrationPage.passwordField, authData.credentials.password)
            .click(RegistrationPage.submitButton);
    }
}
