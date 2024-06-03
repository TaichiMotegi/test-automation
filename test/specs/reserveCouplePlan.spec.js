const LoginPage = require("../pageobjects/login.page");
const MyPage = require("../pageobjects/my.page");
const PlansPage = require("../pageobjects/plans.page");
const ReservePage = require("../pageobjects/reserve.page");
const TopPage = require("../pageobjects/top.page");

describe("カップル限定プラン予約", () => {
  afterEach(async () => {
    if ((await browser.getWindowHandles()).length > 1) {
      await browser.closeWindow();
    }
    await browser.switchWindow(/^宿泊プラン一覧.+$/);
  });

  it("宿泊数と宿泊人数がプランに当てはまらない場合エラーとなること", async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue("sakura@example.com");
    await LoginPage.password.setValue("pass1234");
    await LoginPage.submit();
    await MyPage.goToPlansPage();
    await PlansPage.openPlanByTitle("カップル限定プラン");
    await browser.switchWindow(/^宿泊予約.+$/);
    await ReservePage.setReserveDate("2024/07/15");
    await ReservePage.reserveTerm.setValue("5");
    await ReservePage.headCount.setValue("1");
    await ReservePage.setEarlyCheckInPlan(true);
    await ReservePage.username.setValue("松本さくら");
    await ReservePage.contact.selectByVisibleText("メールでのご連絡");
    await ReservePage.email.setValue("yoshiki@example.com");

    // 宿泊数が有効でない値の時にエラーが表示されるか確認
    await expect(ReservePage.reserveTermMessage).toHaveText(
      "2以下の値を入力してください。"
    );
    // 宿泊人数が有効でない値の時にエラーが表示されるか確認
    await expect(ReservePage.headCountMessage).toHaveText(
      "2以上の値を入力してください。"
    );
  });

  it("土日宿泊の際に土日料金を適用すること", async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue("sakura@example.com");
    await LoginPage.password.setValue("pass1234");
    await LoginPage.submit();
    await MyPage.goToPlansPage();
    await PlansPage.openPlanByTitle("カップル限定プラン");
    await browser.switchWindow(/^宿泊予約.+$/);
    await ReservePage.setReserveDate("2024/07/20");
    await ReservePage.reserveTerm.setValue("2");
    await ReservePage.headCount.setValue("2");
    await ReservePage.setEarlyCheckInPlan(true);
    await ReservePage.username.setValue("松本さくら");
    await ReservePage.contact.selectByVisibleText("メールでのご連絡");
    await ReservePage.email.setValue("yoshiki@example.com");

    // 合計金額が土日料金を適用しているか確認
    await expect(ReservePage.totalBill).toHaveText("42,000円");
  });
});
