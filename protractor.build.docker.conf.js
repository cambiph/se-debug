// Set preferences: https://firefox-source-docs.mozilla.org/testing/geckodriver/geckodriver/Capabilities.html#prefs-object

exports.config = {
    allScriptsTimeout: 30000,
    seleniumPort: 4444,
    seleniumAddress: "http://localhost:4444/wd/hub",
    framework: "jasmine",
    specs: ["spec.js"],
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        isVerbose: true,
        includeStackTrace: true
    },
    maxSessions: 1,
    capabilities: {
        "browserName": "firefox",
        //"moz:firefoxOptions": {
        //    "args": ["-profile", "/tmp/firefox_profiles/iulazd0z.selenium"],
        //}
    },
    plugins: [{
        package: "protractor-screenshoter-plugin",
        screenshotPath: "./target/screenshots",
        screenshotOnExpect: "failure",
        screenshotOnSpec: "none",
        htmlOnExpect: "none",
        htmlOnSpec: "none",
        imageToAscii: "none",
        clearFoldersBeforeTest: true
    }],

    onPrepare: function () {
        let failFast = require("jasmine-fail-fast");
        jasmine.getEnv().addReporter(failFast.init());
        return require("./onPrepare.js")(global, "firefox");
    }
};