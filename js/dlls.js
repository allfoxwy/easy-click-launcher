const fs = require("fs");
const path = require("path");

module.exports.addSideload = function (win, modFilename) {
    let dirName = path.dirname(win.localStorage.gamePath);
    let srcName = path.join(dirName, "dlls.txt");

    let src;
    try {
        src = fs.readFileSync(srcName, "utf8");
    }
    catch (err) {
        src = "";
    }

    srcLines = src.split("\n");

    let alreadyIn = false;
    for (let line of srcLines) {
        line = line.trim();
        if (line.length === 0) {
            continue;
        }

        let commentPos = line.indexOf("#");
        let find = line.indexOf(modFilename);

        if (find > -1) {
            if (commentPos > -1 && commentPos < find) {
                continue;
            }

            alreadyIn = true;
            break;
        }
    }

    if (alreadyIn === false) {
        src += "\r\n";
        src += modFilename;

        fs.writeFileSync(srcName, src);
    }
}

module.exports.deleteSideload = function (win, modFilename) {
    let dirName = path.dirname(win.localStorage.gamePath);
    let srcName = path.join(dirName, "dlls.txt");

    let src;
    try {
        src = fs.readFileSync(srcName, "utf8");
    }
    catch (err) {
        src = "";
    }

    srcLines = src.split("\n");
    newLines = [];

    let alreadyIn = false;
    for (let line of srcLines) {
        line = line.trim();
        if (line.length === 0) {
            continue;
        }

        let commentPos = line.indexOf("#");
        let find = line.indexOf(modFilename);

        if (find > -1) {
            if (commentPos > -1 && commentPos < find) {
                newLines.push(line);
                continue;
            }

            alreadyIn = true;
            continue; // skip this line, so resulting new lines won't have this mod
        }

        newLines.push(line);
    }

    if (alreadyIn === true) {
        let newStr = "";
        for (let line of newLines) {
            line = line.replaceAll("\r", "");
            newStr += line + "\r\n";
        }
        fs.writeFileSync(srcName, newStr);
    }
}

