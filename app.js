document.getElementById("startButton").addEventListener("click", function() {
    const startTimeInput = document.getElementById("startTime").value;
    if (startTimeInput) {
        document.getElementById("setup").style.display = "none"; // Hide the setup input
        startClock(startTimeInput);
    }
});

function startClock(startTime) {
    let startDateTime = new Date();
    startDateTime.setHours(startTime.split(":")[0], startTime.split(":")[1], 0, 0);
    
    const titleElement = document.createElement("div");
    titleElement.style.fontSize = "3em";
    titleElement.style.fontWeight = "bold";
    titleElement.style.marginBottom = "20px";
    document.body.insertBefore(titleElement, document.getElementById("clock"));
    
    const clockElement = document.getElementById("clock");
    const intervalTimerElement = document.getElementById("intervalTimer");
    const intervalCounterElement = document.getElementById("intervalCounter");
    const messageElement = document.getElementById("message");

    function updateTime() {
        const now = new Date();
        let elapsed = Math.floor((now - startDateTime) / 1000);
        let hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        let minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        let seconds = String(elapsed % 60).padStart(2, '0');
        
        if (elapsed < 540) {
            // First 9 minutes: Set-up Time
            titleElement.textContent = "Set-up Time";
            intervalTimerElement.style.display = "block";
            intervalCounterElement.style.display = "block";
            messageElement.style.display = "block";
            
            const intervalElapsed = elapsed % 180;
            const remaining = 180 - intervalElapsed;
            const intervalMinutes = String(Math.floor(remaining / 60)).padStart(2, '0');
            const intervalSeconds = String(remaining % 60).padStart(2, '0');
            intervalTimerElement.textContent = `Time Left in 3-Minute Interval: ${intervalMinutes}:${intervalSeconds}`;
            
            const intervalCount = Math.floor(elapsed / 180) + 1;
            intervalCounterElement.textContent = `Interval Number: ${intervalCount}`;

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
        } else if (elapsed < 660) {
            // Minutes 10 and 11: Pause
            titleElement.textContent = "Pause";
            intervalTimerElement.style.display = "none";
            intervalCounterElement.style.display = "none";
            messageElement.style.display = "none";
            document.body.style.backgroundColor = "#f0f0f0"; // Default background color
        } else {
            // After 11 minutes: Demo
            if (elapsed === 660) {
                startDateTime = new Date(); // Restart the elapsed time
            }
            elapsed = Math.floor((now - startDateTime) / 1000);
            hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
            minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
            seconds = String(elapsed % 60).padStart(2, '0');

            titleElement.textContent = "Demo";
            intervalTimerElement.style.display = "block";
            intervalCounterElement.style.display = "block";
            messageElement.style.display = "block";

            const intervalElapsed = elapsed % 180;
            const remaining = 180 - intervalElapsed;
            const intervalMinutes = String(Math.floor(remaining / 60)).padStart(2, '0');
            const intervalSeconds = String(remaining % 60).padStart(2, '0');
            intervalTimerElement.textContent = `Time Left in 3-Minute Interval: ${intervalMinutes}:${intervalSeconds}`;
            
            const intervalCount = Math.floor(elapsed / 180) + 1;
            intervalCounterElement.textContent = `Interval Number: ${intervalCount}`;

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

        clockElement.textContent = `Elapsed Time: ${hours}:${minutes}:${seconds}`;
    }

    setInterval(updateTime, 1000);
}
