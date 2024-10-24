const fs = require("fs");
const path = require("path");

module.exports.ensureConfig = function (win, key, value) {
    key = key.toString();
    value = value.toString();

    let wowDir = path.dirname(win.localStorage.gamePath);
    let srcName = path.join(wowDir, "WTF", "Config.wtf");

    let src = "";
    if(fs.existsSync(srcName)) {
        src = fs.readFileSync(srcName, "utf-8");
    }

    let srcLines = src.split("\n");
    let dstLines = [];

    let alreadyIn = false;

    for(let line of srcLines) {
        line = line.trim();
        if(line.length === 0) {
            continue;
        }

        let reConfig = /SET\s+(?<key>.+)\s+"(?<value>.+)"/;

        let match = reConfig.exec(line);
        if(match !== null) {
            if(key === match.groups.key) {
                alreadyIn = true;
                dstLines.push("SET " + key + ' "' + value + '"');
                continue;
            }
        }
        
        dstLines.push(line);
    }

    if(alreadyIn === false) {
        dstLines.push("SET " + key + ' "' + value + '"');
    }

    let dst = "";
    for(let line of dstLines) {
        dst += line + "\r\n";
    }

    let configDir = path.join(wowDir, "WTF");
    if(fs.existsSync(configDir) === false) {
        fs.mkdirSync(configDir);
    }

    fs.writeFileSync(srcName, dst);
}
