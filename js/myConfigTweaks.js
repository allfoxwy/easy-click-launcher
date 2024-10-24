const path = require("path");
const fs = require("fs");
const config = require("js/Config.wtf.js");

module.exports.run = function(win) {
    if(win.localStorage.enableQPC === "yes") {
        config.ensureConfig(win, "timingModeOverride", "3");
    }

    if(win.localStorage.enableM2Faster === "yes") {
        config.ensureConfig(win, "M2Faster", "3");
    }

    if(win.localStorage.enableClearWDB === "yes") {
        let wdb = path.join(path.dirname(win.localStorage.gamePath), "WDB");
        
        if(fs.existsSync(wdb)) {
            fs.rmdirSync(wdb, {
                recursive: true,
            });
        }
    }
}
