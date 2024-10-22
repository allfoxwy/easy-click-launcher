
function launch() {
    let p = require("child_process").exec(localStorage.gamePath, function (err, stdout, stderr) {
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


// Main entrance
$(function () {
    nw.Window.get().setPosition("center");

    const expectedVersion = 1;

    if (localStorage.dataVersion != expectedVersion) {
        localStorage.clear();

        localStorage.dataVersion = expectedVersion;
        localStorage.gamePath = "";
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
        }
    });

    $(".button-launch").on("click", function () {
        if (localStorage.gamePath.length > 0) {
            $(".root").css("display", "none");
            $(".starting-message").css("display", "block");

            let steps = [
                "js/vanilla-dll-sideloader.js",
            ];

            try {
                for (let i = 0; i < steps.length; ++i) {
                    require(steps[i]).run(window, nw);
                }
            } catch (err) {
                alert(err);
                $(".root").css("display", "block");
                $(".starting-message").css("display", "none");
                return;
            }

            //launch();
        } else {
            alert("Please decide where the game is by clicking the button next to Game Path.")
        }
    });
});

