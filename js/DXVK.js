const fs = require("fs");
const path = require("path");
const config = require("js/Config.wtf.js");

module.exports.ensureDXVKconfig = function (win, key, value) {
    if (typeof (value) === "string") {
        if (value.toLowerCase() === "auto") {
            value = "Auto";
        } else {
            value = "\"" + value + "\"";
        }
    }
    if (typeof (value) === "boolean") {
        if (value) {
            value = "True";
        } else {
            value = "False";
        }
    }
    if (typeof (value) === "number") {
        value = value.toString();
    }

    key = key.toString();

    let wowDir = path.dirname(win.localStorage.gamePath);
    let srcName = path.join(wowDir, "dxvk.conf");

    let src = "";
    if (fs.existsSync(srcName)) {
        src = fs.readFileSync(srcName, "utf-8");
    }

    let srcLines = src.split("\n");
    let dstLines = [];

    let alreadyIn = false;

    for (let line of srcLines) {
        line = line.trim();
        if (line.length === 0) {
            continue;
        }

        let commentPos = line.indexOf("#");
        let keyPos = line.indexOf(key);

        let reConfig = /(?<key>\S+)\s*=\s*(?<value>\S+)/;

        let match = reConfig.exec(line);
        if (match !== null) {
            if ((commentPos === -1 || commentPos > keyPos)
                && key === match.groups.key) {
                alreadyIn = true;
                dstLines.push(key + ' = ' + value);
                continue;
            }
        }

        dstLines.push(line);
    }

    if (alreadyIn === false) {
        dstLines.push(key + ' = ' + value);
    }

    let dst = "";
    for (let line of dstLines) {
        dst += line + "\r\n";
    }

    fs.writeFileSync(srcName, dst);
}

module.exports.run = function (win) {
    let wowPath = path.dirname(win.localStorage.gamePath);
    let dxvkPath = path.join(wowPath, "d3d9.dll");
    let cursorPath = path.join(wowPath, "SideloadCursors");

    if (fs.existsSync(cursorPath)) {
        fs.rmdirSync(cursorPath, {
            recursive: true,
        });
    }

    if (win.localStorage.enableDXVK === "yes") {
        fs.copyFileSync(path.join(process.cwd(), "lib", "d3d9.dll"), dxvkPath);
        config.ensureConfig(win, "gxApi", "direct3d");

        let cursorSize = parseInt(win.localStorage.hardwareCursorSize);

        if (cursorSize === 2) {
            fs.cpSync(path.join(process.cwd(), "lib", "SideloadCursors2X"), cursorPath, {
                recursive: true,
            });
            config.ensureConfig(win, "gxCursor", "1");
            this.ensureDXVKconfig(win, "d3d9.enlargeHardwareCursor", 2);
        } else if (cursorSize === 3) {
            fs.cpSync(path.join(process.cwd(), "lib", "SideloadCursors3X"), cursorPath, {
                recursive: true,
            });
            config.ensureConfig(win, "gxCursor", "1");
            this.ensureDXVKconfig(win, "d3d9.enlargeHardwareCursor", 3);
        } else if (cursorSize === 4) {
            fs.cpSync(path.join(process.cwd(), "lib", "SideloadCursors4X"), cursorPath, {
                recursive: true,
            });
            config.ensureConfig(win, "gxCursor", "1");
            this.ensureDXVKconfig(win, "d3d9.enlargeHardwareCursor", 4);
        } else {
            this.ensureDXVKconfig(win, "d3d9.enlargeHardwareCursor", 0);
        }
    } else {
        if (fs.existsSync(dxvkPath)) {
            fs.unlinkSync(dxvkPath);
        }
    }
}
