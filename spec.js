describe('Actions API test case', function() {

    it('moveto does not get recognized as a command', function() {
        browser.get(browser.baseUrl).then(function() {
            browser.actions().mouseMove(element(by.css('.card-text-container'))).perform();
        });
    });

    it('moveto does not get recognized as a command using legacy mode', function() {
        browser.get(browser.baseUrl).then(function() {
            browser.actions({bridge: true}).mouseMove(element(by.css('.card-text-container'))).perform();
        });
    });
});