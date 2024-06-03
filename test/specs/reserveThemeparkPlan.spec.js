const ConfirmPage = require("../pageobjects/confirm.page");
const LoginPage = require("../pageobjects/login.page");
const MyPage = require("../pageobjects/my.page");
const PlansPage = require("../pageobjects/plans.page");
const ReservePage = require("../pageobjects/reserve.page");
const TopPage = require("../pageobjects/top.page");

describe("テーマパーク優待プラン予約", () => {
  it("宿泊予約が正常に完了すること", async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue("ichiro@example.com");
    await LoginPage.password.setValue("password");
    await LoginPage.submit();
    await MyPage.goToPlansPage();
    await PlansPage.openPlanByTitle("テーマパーク優待プラン");
    await browser.switchWindow(/^宿泊予約.+$/);
    await ReservePage.setReserveDate("2024/07/15");
    await ReservePage.reserveTerm.setValue("3");
    await ReservePage.headCount.setValue("2");
    await ReservePage.setBreakfastPlan(true);
    await ReservePage.username.setValue("山田一郎");
    await ReservePage.contact.selectByVisibleText("電話でのご連絡");
    await ReservePage.tel.setValue("00011112222");

    // 宿泊予約画面で表示される合計が正しいか確認
    await expect(ReservePage.totalBill).toHaveText("66,000円");

    await ReservePage.submit();

    // 宿泊予約確認画面で表示されている情報が正しいか確認
    await expect(ConfirmPage.totalBill).toHaveText("合計 66,000円（税込み）");
    await expect(ConfirmPage.planName).toHaveText("テーマパーク優待プラン");
    await expect(ConfirmPage.term).toHaveText(
      "2024年7月15日 〜 2024年7月18日 3泊"
    );
    await expect(ConfirmPage.headCount).toHaveText("2名様");
    await expect(ConfirmPage.plans).toHaveTextContaining("朝食バイキング");
    await expect(ConfirmPage.username).toHaveText("山田一郎様");
    await expect(ConfirmPage.contact).toHaveText("電話：00011112222");

    await ConfirmPage.confirm();

    // ポップアップメッセージに予約を完了しましたと表示されているか確認
    await expect(ConfirmPage.modalTitle).toHaveText("予約を完了しました");

    await ConfirmPage.close();

    // 宿泊プラン一覧画面に戻っているか確認
    await expect(
      await browser.waitUntil(
        async () => (await browser.getWindowHandles()).length === 1
      )
    ).toBeTruthy();
    await browser.switchWindow(/^宿泊プラン一覧.+$/);
    await expect(PlansPage.pageTitle).toHaveText("宿泊プラン一覧");
  });
});
