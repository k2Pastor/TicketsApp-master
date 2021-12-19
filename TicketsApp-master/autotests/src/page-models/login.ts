import { Selector, t } from "testcafe";
import * as authData from "../data/auth.json"

export class LoginPage {
    static readonly loginButton = Selector("#loginSubmit");
    static readonly emailField = Selector("#loginEmail");
    static readonly passwordField = Selector("#loginPassword");

    static async authAdmin(): Promise<void> {
        await t
            .typeText(LoginPage.emailField, authData.adminCredentials.email)
            .typeText(LoginPage.passwordField, authData.adminCredentials.password)
            .click(LoginPage.loginButton);
    }

    static async authUser(): Promise<void> {
        await t
            .typeText(LoginPage.emailField, authData.credentials.email)
            .typeText(LoginPage.passwordField, authData.credentials.password)
            .click(LoginPage.loginButton);
    }
}
