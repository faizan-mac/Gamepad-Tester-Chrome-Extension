document.addEventListener("DOMContentLoaded", function () {
    let polling_freq = null
    window.addEventListener("gamepadconnected", (e) => {
        //event gamepad
        let gp = e.gamepad
        const input_count = Number(gp.buttons.length) + Number(gp.axes.length)
        let record_count = 0

        //print controller info
        document.querySelector("#info").innerHTML = `${gp.id}`

        //wake controller
        function rumble() {
            gp.vibrationActuator.playEffect('dual-rumble', {
                duration: 400,
                weakMagnitude: 0.6,
                strongMagnitude: 0.6,
            })
        };

        //display inputs
        for (let i = 0; i < gp.buttons.length; i++) {
            let li = document.createElement("li")
            li.innerHTML = `input${i}`
            li.setAttribute("id", `input${i}`)
            document.querySelector("#inputs").append(li)
        }
        for (let i = 0; i < gp.axes.length; i++) {
            let li = document.createElement("li")
            li.innerHTML = `axis${i}`
            li.setAttribute("id", `axis${i}`)
            document.querySelector("#inputs").append(li)
        }
        let button = document.createElement("button")
        button.innerHTML = "Rumble"
        button.addEventListener("click", rumble)
        document.querySelector("#inputs").append(button)

        //polling gamepad for updated input status
        polling_freq = setInterval(pollGamepads, 10);
        function pollGamepads() {
            //record input status
            console.log("Polling...")
            for (let i = 0; i < gp.buttons.length; i++) {
                if (navigator.getGamepads()[gp.index].buttons[i].touched) {
                    if (!document.querySelector(`#input${i}`).classList.contains("input_read")) {
                        document.querySelector(`#input${i}`).classList.add("input_read")
                        record_count++
                    }
                }
            }
            for (let i = 0; i < gp.axes.length; i++) {
                axis_val = navigator.getGamepads()[gp.index].axes[i]
                if (axis_val >= 0.8 || axis_val <= -0.8) {
                    if (!document.querySelector(`#axis${i}`).classList.contains("input_read")) {
                        document.querySelector(`#axis${i}`).classList.add("input_read")
                        record_count++
                    }
                }
            }
            if (record_count == input_count) {
                clearInterval(polling_freq)
                document.querySelector("#ok").style.display = "block"
            }
        }
    });
    window.addEventListener("gamepaddisconnected", (e) => {
        //clear extension content and stop polling
        document.querySelector("#info").innerHTML = ""
        document.querySelector("#inputs").innerHTML = ""
        document.querySelector("#ok").style.display = "none"
        clearInterval(polling_freq)
    });
});
