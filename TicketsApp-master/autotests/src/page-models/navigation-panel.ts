import {Selector, t} from "testcafe";

export class NavigationPanel {
    static readonly navigationItems = Selector("#navbar .navbar-menu-item");
    static readonly buttonPanelItems = Selector("#navbar .header-button-panel .ant-btn")

    public static async navigateToTab(tabName: string) {
        await t
            .click(NavigationPanel.navigationItems.withText(tabName));
    }

    public static async navigateToButton(buttonName: string) {
        await t
            .click(NavigationPanel.buttonPanelItems.withText(buttonName));
    }
}
