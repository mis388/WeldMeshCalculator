const calculateButton = document.querySelector("button");

calculateButton.addEventListener("click", function () {

    const lengthFt = parseFloat(
        document.getElementById("rollLength").value
    );

    const widthFt = parseFloat(
        document.getElementById("rollWidth").value
    );

    const diameter = parseFloat(
        document.getElementById("wireDiameter").value
    );

    const linePitch = parseFloat(
        document.getElementById("linePitch").value
    );

    const crossPitch = parseFloat(
        document.getElementById("crossPitch").value
    );

    if (
        lengthFt <= 0 ||
        widthFt <= 0 ||
        diameter <= 0 ||
        linePitch <= 0 ||
        crossPitch <= 0
    ) {
        alert("Please enter valid values.");
        return;
    }

    // Convert feet to millimetres
    const lengthMM = lengthFt * 304.8;
    const widthMM = widthFt * 304.8;

    // Convert feet to metres
    const lengthM = lengthFt * 0.3048;
    const widthM = widthFt * 0.3048;

    // Calculate number of wires
    const lineWires = Math.ceil(
        widthMM / linePitch
    );

    const crossWires = Math.ceil(
        lengthMM / crossPitch
    );

    // Calculate total length of wire
    const lineWireLength =
        lineWires * lengthM;

    const crossWireLength =
        crossWires * widthM;

    const totalWireLength =
        lineWireLength + crossWireLength;

    // Approximate steel wire weight in kg per metre
    const kgPerMeter =
        0.00619 * diameter * diameter;

    // Calculate roll weight
    const rollWeight =
        totalWireLength * kgPerMeter;

    // Calculate roll area
    const areaSqft =
        lengthFt * widthFt;

    // Calculate weight per sqft
    const kgPerSqft =
        rollWeight / areaSqft;

    // Show results
    document.getElementById("resultLineWires").textContent =
        lineWires;

    document.getElementById("resultCrossWires").textContent =
        crossWires;

    document.getElementById("resultRollWeight").textContent =
        rollWeight.toFixed(2);

    document.getElementById("resultKgPerSqft").textContent =
        kgPerSqft.toFixed(4);
});
if ("serviceWorker" in navigator) {

    window.addEventListener("load", async function () {

        try {

            const registration =
                await navigator.serviceWorker.register(
                    "/service-worker.js"
                );

            console.log(
                "METFAB offline mode ready."
            );


            /* CHECK FOR UPDATES */

            registration.update();


            /* NEW SERVICE WORKER FOUND */

            registration.addEventListener(
                "updatefound",
                function () {

                    const newWorker =
                        registration.installing;

                    if (!newWorker) {
                        return;
                    }

                    newWorker.addEventListener(
                        "statechange",
                        function () {

                            if (
                                newWorker.state ===
                                "installed"
                            ) {

                                console.log(
                                    "New app version installed."
                                );

                            }

                        }
                    );

                }
            );

        }

        catch (error) {

            console.log(
                "Service worker error:",
                error
            );

        }

    });


    /* WHEN NEW VERSION TAKES CONTROL */

    let refreshing = false;

    navigator.serviceWorker.addEventListener(
        "controllerchange",
        function () {

            if (refreshing) {
                return;
            }

            refreshing = true;

            console.log(
                "New version active. Reloading..."
            );

            window.location.reload();

        }
    );

}
