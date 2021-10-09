/* eslint-disable no-undef */

describe('My first suite tests E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should have info about cancel subscription', async () => {
    const info = await element(by.text('Cancel anytime. Ofter terms apply.'));
    await expect(info).toBeVisible();
  });

  it('should to able to subscribe to premium plan', async () => {
    await element(by.id('option-premium')).tap();
    await element(by.id('input-email')).tap();
    await element(by.id('input-email')).typeText('teste@teste.com');
    await element(by.id('keyboard')).tap();
    await element(by.id('button-subscribe')).tap();

    // await device.takeScreenshot('snapshot-premium-plan-test');
    await expect(element(by.id('confirmation-message'))).toBeVisible();
  });
});
