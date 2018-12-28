describe('Actions API test case', function() {

    it('moveto does not get recognized as a command', function() {
        browser.get('www.seleniumhq.org').then(function() {
            browser.actions().mouseMove(element(by.css('.downloadBox'))).perform();
        });
    });

    it('moveto does not get recognized as a command using legacy mode', function() {
        browser.get('www.seleniumhq.org').then(function() {
            browser.actions({bridge: true}).mouseMove(element(by.css('.downloadBox'))).perform();
        });
    });
});