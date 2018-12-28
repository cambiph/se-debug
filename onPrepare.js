const request = require('request');
const tough = require('tough-cookie');
const onPrepare = function (global, browser_name) {

    const fs = require('fs');
    global.resetData = function (callback) {
        browser.waitForAngularEnabled(false);
        browser.driver.get(browser.baseUrl + 'rest/db/reload').then(function () {
            browser.driver.wait(function () {
                return browser.driver.findElement(by.tagName('body')).getText().then(function (text) {
                    return text === "DATA RELOADED"
                });
            });
            browser.waitForAngularEnabled(true);
            callback();
        });
    };

    global.reindexDossiers = function () {
        browser.waitForAngularEnabled(false);
        return browser.driver.get(browser.baseUrl + 'rest/index/reindex').then(function () {
            browser.driver.wait(function () {
                return browser.driver.findElement(by.tagName('body')).getText().then(function (text) {
                    return text === "DATA REINDEXED"
                });
            });
            browser.waitForAngularEnabled(true);
        });
    };

    global.scrollToElementWithId = function (elementId) {
        const filter = browser.findElement(by.id(elementId));
        const scrollIntoView = function () {
            arguments[0].scrollIntoView();
        };
        return browser.executeScript(scrollIntoView, filter);
    };

    global.downloadFile = function (expectedFileName, startDownloadFunction) {
        const filename = '/tmp/' + expectedFileName;
        if (fs.exists(filename)) {
            fs.unlinkSync(filename);
        }
        return startDownloadFunction().then(function() {
        	return browser.driver.wait(function () {
        		return fs.existsSync(filename);
        	}, 10000).then(function () {
        		return fs.readFileSync(filename, {encoding: 'utf8'});
        	});
        });
    };

    global.clickAndOpenInTab = function (element) {
        const metaKey = browser.isOnMac ? protractor.Key.COMMAND : protractor.Key.CONTROL;
        return browser.driver.getAllWindowHandles().then(function (handles) {
            const amountOfOpenTabs = handles.length;
            return browser.actions().mouseMove(element).keyDown(metaKey).click().keyUp(metaKey).perform().then(function () {
                return browser.driver.wait(minimumWindowCountFunction(amountOfOpenTabs + 1), 15000);
            });
        });
    };

    global.minimumWindowCountFunction = function (count) {
        return function () {
            return browser.driver.getAllWindowHandles().then(function (handles) {
                return handles.length >= count;
            });
        };
    };

    global.doUntil = function (fun, condition) {
        return fun().then(function () {
            condition().then(function (conditionResult) {
                if (!conditionResult) {
                    browser.sleep(2500);
                    return doUntil(fun, condition);
                }
            });
        });
    };

    if (global.hostname && global.hostname !== 'localhost') {
        var remote = require('selenium-webdriver/remote');
        browser.setFileDetector(new remote.FileDetector());
    }

    browser.driver.manage().window().setSize(2560, 1440).then(function () {
        browser.driver.get(browser.baseUrl).then(function () {
            browser.manage().addCookie({name: 'vo_gdpr', value: 'true'}).then(function () {
                const jasmineReporters = require('jasmine-reporters');
                return browser.getCapabilities().then(function () {
                    const browserName = browser_name.toUpperCase();
                    const reporter = new jasmineReporters.JUnitXmlReporter({
                        savePath: 'target/surefire-reports',
                        consolidateAll: false,
                        filePrefix: browserName + "-"
                    });

                    const decorated = reporter.getFullName;
                    reporter.getFullName = function (suite, isFileName) {
                        return browserName + "." + decorated(suite, isFileName);
                    };

                    jasmine.getEnv().addReporter(reporter);
                    browser.isIE = browserName.indexOf("INTERNET") !== -1;
                    browser.isChrome = browserName.indexOf("CHROME") !== -1;
                    browser.isFirefox = browserName.indexOf("FIREFOX") !== -1;
                    browser.isOnMac = process.platform === "darwin";
                });
            });
        });
    });

};
module.exports = onPrepare;