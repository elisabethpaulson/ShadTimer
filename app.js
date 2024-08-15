function startClock(startTime) {
    const startDateTime = new Date();
    startDateTime.setHours(startTime.split(":")[0], startTime.split(":")[1], 0, 0);
    const clockElement = document.getElementById("clock");
    const intervalTimerElement = document.getElementById("intervalTimer");
    const intervalCounterElement = document.createElement("div");
    intervalCounterElement.style.fontSize = "1.5em";
    intervalCounterElement.style.marginTop = "20px";
    document.body.appendChild(intervalCounterElement);

    const messageElement = document.createElement("div");
    messageElement.style.fontSize = "2em";
    messageElement.style.fontStyle = "italic";
    messageElement.style.marginTop = "10px";
    document.body.appendChild(messageElement);

    function updateTime() {
        const now = new Date();
        const elapsed = Math.floor((now - startDateTime) / 1000);
        const hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const seconds = String(elapsed % 60).padStart(2, '0');
        clockElement.textContent = `Elapsed Time: ${hours}:${minutes}:${seconds}`;

        const intervalElapsed = elapsed % 180;
        const remaining = 180 - intervalElapsed;
        const intervalMinutes = String(Math.floor(remaining / 60)).padStart(2, '0');
        const intervalSeconds = String(remaining % 60).padStart(2, '0');
        intervalTimerElement.textContent = `Next 3-Minute Interval: ${intervalMinutes}:${intervalSeconds}`;

        const intervalCount = Math.floor(elapsed / 180) + 1;
        intervalCounterElement.textContent = `Current 3-Minute Interval: ${intervalCount}`;

        // Update background color and message based on the time within the 3-minute interval
        if (intervalElapsed < 60) {
            document.body.style.backgroundColor = "green";
            messageElement.textContent = "Place orders now";
        } else if (intervalElapsed >= 120) {
            document.body.style.backgroundColor = "orange";
            messageElement.textContent = "Fulfill orders now";
        } else {
            document.body.style.backgroundColor = "#f0f0f0"; // Default background color
            messageElement.textContent = ""; // No message during the second minute
        }
    }

    setInterval(updateTime, 1000);
}

startClock("12:02"); // Start