const config = require("js/Config.wtf.js");

module.exports.run = function(win) {
    if(win.localStorage.enableQPC === "yes") {
        config.ensureConfig(win, "timingModeOverride", "3");
    }

    if(win.localStorage.enableM2Faster === "yes") {
        config.ensureConfig(win, "M2Faster", "3");
    }
}
