const path = require("path");

function launch() {
    let runPath;
    if (path.extname(localStorage.gamePath).toLowerCase() === ".exe") {
        runPath = path.join(path.dirname(localStorage.gamePath), "WoW_sideload-DLL.exe");
    } else {
        runPath = localStorage.gamePath;
    }

    let p = require("child_process").exec(runPath, function (err, stdout, stderr) {
        if (err) {
            alert(err);
            return;
        }
    });

    p.on("close", function () {
        nw.Window.get().close();
    });

    p.unref();
}

function setHardwareCursorSize(size) {
    size = parseInt(size);

    if (size === 2) {
        $(".label-cursor-size").text("2X sized Cursor");
        localStorage.hardwareCursorSize = size.toString();
        return;
    }
    if (size === 3) {
        $(".label-cursor-size").text("3X sized Cursor");
        localStorage.hardwareCursorSize = size.toString();
        return;
    }
    if (size === 4) {
        $(".label-cursor-size").text("4X sized Cursor");
        localStorage.hardwareCursorSize = size.toString();
        return;
    }

    $(".label-cursor-size").text("Original Cursor");
    localStorage.hardwareCursorSize = "1";
    return;
}

// Main entrance
$(function () {
    nw.Window.get().setPosition("center");

    const expectedVersion = 11;

    if (localStorage.dataVersion != expectedVersion) {
        localStorage.clear();

        localStorage.dataVersion = expectedVersion;
        localStorage.gamePath = "";
        localStorage.enableUnitXPsp3 = "yes";
        localStorage.enableQPC = "yes";
        localStorage.enableM2Faster = "yes";
        localStorage.enableClearWDB = "yes";
        localStorage.enableDXVK = "yes";
        localStorage.hardwareCursorSize = "1";
    }

    if (localStorage.gamePath.length > 0) {
        $(".button-game-path").text(localStorage.gamePath);
    } else {
        $(".button-game-path").text("Not Yet Decided");
    }

    $(".button-game-path").on("click", function () {
        $(".game-path").click();
    });

    $(".game-path").on("change", function () {
        if (this.files.length == 1) {
            localStorage.gamePath = $(".game-path").val();
            $(".button-game-path").text(localStorage.gamePath);

            if (path.extname(localStorage.gamePath).toLowerCase() !== ".exe") {
                alert("You are selecting a non-PE file for game path. While you surely could make a batch/script for starting the game, please use WoW_sideload-DLL.exe in your batch/script so that mod loader would work.");
            }
        }
    });

    if (localStorage.enableDXVK === "yes") {
        $("#enable-DXVK").prop("checked", true);
        $(".label-cursor-size").prop("disabled", false);
    } else {
        $("#enable-DXVK").prop("checked", false);
        $(".label-cursor-size").prop("disabled", true);
    }

    $("#enable-DXVK").on("change", function () {
        if ($("#enable-DXVK").prop("checked") === true) {
            localStorage.enableDXVK = "yes";
            $(".label-cursor-size").prop("disabled", false);
        } else {
            localStorage.enableDXVK = "no";
            $(".label-cursor-size").prop("disabled", true);
        }
    });

    setHardwareCursorSize(localStorage.hardwareCursorSize);

    if (localStorage.enableUnitXPsp3 === "yes") {
        $("#enable-UnitXP-SP3").prop("checked", true);
    } else {
        $("#enable-UnitXP-SP3").prop("checked", false);
    }

    $("#enable-UnitXP-SP3").on("change", function () {
        if ($("#enable-UnitXP-SP3").prop("checked") === true) {
            localStorage.enableUnitXPsp3 = "yes";
        } else {
            localStorage.enableUnitXPsp3 = "no";
        }
    });

    if (localStorage.enableQPC === "yes") {
        $("#enable-QPC").prop("checked", true);
    } else {
        $("#enable-QPC").prop("checked", false);
    }

    $("#enable-QPC").on("change", function () {
        if ($("#enable-QPC").prop("checked") === true) {
            localStorage.enableQPC = "yes";
        } else {
            localStorage.enableQPC = "no";
        }
    });

    if (localStorage.enableM2Faster === "yes") {
        $("#enable-M2Faster").prop("checked", true);
    } else {
        $("#enable-M2Faster").prop("checked", false);
    }

    $("#enable-M2Faster").on("change", function () {
        if ($("#enable-M2Faster").prop("checked") === true) {
            localStorage.enableM2Faster = "yes";
        } else {
            localStorage.enableM2Faster = "no";
        }
    });

    if (localStorage.enableClearWDB === "yes") {
        $("#enable-clearWDB").prop("checked", true);
    } else {
        $("#enable-clearWDB").prop("checked", false);
    }

    $("#enable-clearWDB").on("change", function () {
        if ($("#enable-clearWDB").prop("checked") === true) {
            localStorage.enableClearWDB = "yes";
        } else {
            localStorage.enableClearWDB = "no";
        }
    });

    $(".button-launch").on("click", function () {
        if (localStorage.gamePath.length > 0) {
            $(".root").css("display", "none");
            $(".starting-message").css("display", "block");

            setTimeout(() => {
                let steps = [
                    "js/vanilla-dll-sideloader.js",
                    "js/DXVK.js",
                    "js/UnitXP_SP3.js",
                    "js/myConfigTweaks.js",
                ];

                try {
                    for (let i = 0; i < steps.length; ++i) {
                        let m = require(steps[i]);
                        if (m.run !== undefined) {
                            m.run(window);
                        }
                    }
                } catch (err) {
                    alert(err);
                    $(".root").css("display", "block");
                    $(".starting-message").css("display", "none");
                    return;
                }

                launch();
            }, 0);

        } else {
            alert("Please decide where the game is by clicking the button next to Game Path.")
        }
    });
});

