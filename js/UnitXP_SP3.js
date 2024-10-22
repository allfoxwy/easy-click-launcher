const fs = require("fs");
const path = require("path");
const dlls = require("js/dlls.js");

module.exports.getModFilename = function () {
    return "UnitXP_SP3.dll";
}

module.exports.run = function (win) {
    let dirName = path.dirname(win.localStorage.gamePath);

    if (win.localStorage.enableUnitXPsp3 === "yes") {
        fs.copyFileSync(path.join(process.cwd(), "lib", this.getModFilename()), path.join(dirName, this.getModFilename()));

        if (fs.existsSync(path.join(dirName, "Interface")) === false) {
            fs.mkdir(path.join(dirName, "Interface"));
        }

        if (fs.existsSync(path.join(dirName, "Interface", "AddOns")) === false) {
            fs.mkdir(path.join(dirName, "Interface", "AddOns"));
        }

        fs.cpSync(path.join(process.cwd(), "lib", "UnitXP_SP3_Addon"), path.join(dirName, "Interface", "AddOns", "UnitXP_SP3_Addon"), {
            recursive: true,
        });

        dlls.addSideload(win, this.getModFilename());
    } else {
        if (fs.existsSync(path.join(dirName, this.getModFilename())) === true) {
            fs.unlinkSync(path.join(dirName, this.getModFilename()));
        }

        if (fs.existsSync(path.join(dirName, "Interface", "AddOns", "UnitXP_SP3_Addon")) === true) {
            fs.rmdirSync(path.join(dirName, "Interface", "AddOns", "UnitXP_SP3_Addon"), {
                recursive: true,
            });
        }

        dlls.deleteSideload(win, this.getModFilename());
    }
}

