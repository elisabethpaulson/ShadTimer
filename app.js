// Password functionality for unlocking time editing
const PASSWORD = 'Shad2024';

function editAllTimes() {
    const passwordInput = document.getElementById('password').value;

    if (passwordInput === PASSWORD) {
        document.getElementById('oddTeamRun1').disabled = false;
        document.getElementById('evenTeamRun1').disabled = false;
        document.getElementById('oddTeamRun2').disabled = false;
        document.getElementById('evenTeamRun2').disabled = false;
    } else {
        alert('Incorrect password');
    }
}

function saveTimes() {
    const odd1Time = document.getElementById('oddTeamRun1').value;
    const even1Time = document.getElementById('evenTeamRun1').value;
    const odd2Time = document.getElementById('oddTeamRun2').value;
    const even2Time = document.getElementById('evenTeamRun2').value;

    localStorage.setItem('oddTeamRun1', odd1Time);
    localStorage.setItem('evenTeamRun1', even1Time);
    localStorage.setItem('oddTeamRun2', odd2Time);
    localStorage.setItem('evenTeamRun2', even2Time);
}

function loadTimes() {
    document.getElementById('oddTeamRun1').value = localStorage.getItem('oddTeamRun1') || '';
    document.getElementById('evenTeamRun1').value = localStorage.getItem('evenTeamRun1') || '';
    document.getElementById('oddTeamRun2').value = localStorage.getItem('oddTeamRun2') || '';
    document.getElementById('evenTeamRun2').value = localStorage.getItem('evenTeamRun2') || '';
}

function confirmTimes() {
    alert('Start times have been saved.');
    saveTimes(); // Save the times when the user clicks "Enter"
}

window.addEventListener('beforeunload', saveTimes);
window.addEventListener('load', function() {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'index.html' || currentPage === '') {
        loadTimes();
    } else if (currentPage === 'timer.html') {
        initializeTimerPage();
    }
});

// Timer page functionality
function initializeTimerPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const team = urlParams.get('team');

    let startTime = '';

    switch (team) {
        case 'odd1':
            startTime = localStorage.getItem('oddTeamRun1');
            highlightTab('Odd Team Run 1');
            break;
        case 'even1':
            startTime = localStorage.getItem('evenTeamRun1');
            highlightTab('Even Team Run 1');
            break;
        case 'odd2':
            startTime = localStorage.getItem('oddTeamRun2');
            highlightTab('Odd Team Run 2');
            break;
        case 'even2':
            startTime = localStorage.getItem('evenTeamRun2');
            highlightTab('Even Team Run 2');
            break;
        default:
            alert('Invalid team selection');
            window.location.href = 'index.html';
    }

    if (startTime) {
        startClock(startTime);
    } else {
        alert('No start time set for this run');
        window.location.href = 'index.html';
    }
}

function highlightTab(tabName) {
    const links = document.querySelectorAll('.side-panel a');
    links.forEach(link => {
        if (link.textContent.trim() === tabName) {
            link.style.backgroundColor = '#d3d3d3'; // Highlight selected tab
            link.style.fontWeight = 'bold';
        } else {
            link.style.backgroundColor = ''; // Reset background for other tabs
            link.style.fontWeight = ''; // Reset font weight for other tabs
        }
    });
}

function startClock(startTime) {
    let startDateTime = new Date();
    const [startHour, startMinute] = startTime.split(":").map(Number);
    startDateTime.setHours(startHour, startMinute, 0, 0); // Set the actual start time

    let now = new Date();
    let elapsed = Math.floor((now - startDateTime) / 1000);

    const setupDuration = 9 * 60; // 9 minutes in seconds
    const pauseDuration = 2 * 60; // 2 minutes in seconds
    const totalPreDemoDuration = setupDuration + pauseDuration;

    const countdownElement = document.getElementById('countdown');
    const titleElement = document.getElementById('title');
    const clockElement = document.getElementById('elapsedTime'); // Update to use the new ID
    const timeInSetupElement = document.getElementById('timeInSetup');
    const timeInPauseElement = document.getElementById('timeInPause');
    const timeInDemoElement = document.getElementById('timeInDemo');
    const intervalTimerElement = document.getElementById('intervalTimer');
    const intervalCounterElement = document.getElementById('intervalCounter');
    const messageElement = document.getElementById('message');

    function updateTime() {
        now = new Date();
        elapsed = Math.floor((now - startDateTime) / 1000);

        // Continuous Elapsed Time
        const continuousElapsedTime = Math.floor((now - startDateTime) / 1000);
        const continuousHours = String(Math.floor(continuousElapsedTime / 3600)).padStart(2, '0');
        const continuousMinutes = String(Math.floor((continuousElapsedTime % 3600) / 60)).padStart(2, '0');
        const continuousSeconds = String(continuousElapsedTime % 60).padStart(2, '0');
        clockElement.textContent = `Elapsed Time: ${continuousHours}:${continuousMinutes}:${continuousSeconds}`;

        if (elapsed < 0) {
            // Display start time if the elapsed time is negative
            titleElement.textContent = `This run starts at ${startTime}`;
            intervalTimerElement.style.display = "none";
            intervalCounterElement.style.display = "none";
            messageElement.style.display = "none";
            timeInSetupElement.style.display = "none";
            timeInPauseElement.style.display = "none";
            timeInDemoElement.style.display = "none";
            document.body.style.backgroundColor = "#f0f0f0";
            return;
        }

        countdownElement.textContent = ""; // Clear countdown by default

        if (elapsed < setupDuration) {
            // Set-up Time
            titleElement.textContent = "Set-up Time";
            intervalTimerElement.style.display = "block";
            intervalCounterElement.style.display = "block";
            messageElement.style.display = "block";
            timeInSetupElement.style.display = "block";
            timeInPauseElement.style.display = "none";
            timeInDemoElement.style.display = "none";

            const timeInSetup = elapsed;
            const setupMinutes = String(Math.floor(timeInSetup / 60)).padStart(2, '0');
            const setupSeconds = String(timeInSetup % 60).padStart(2, '0');
            timeInSetupElement.textContent = `Time in Set-up: ${setupMinutes}:${setupSeconds}`;

            const intervalElapsed = elapsed % 180;
            const remaining = 180 - intervalElapsed;
            const intervalMinutes = String(Math.floor(remaining / 60)).padStart(2, '0');
            const intervalSeconds = String(remaining % 60).padStart(2, '0');
            intervalTimerElement.textContent = `Time Left in 3-Minute Interval: ${intervalMinutes}:${intervalSeconds}`;

            const intervalCount = Math.floor(elapsed / 180) + 1;
            intervalCounterElement.textContent = `Interval Number: ${intervalCount}`;

            if (intervalElapsed < 60) {
                const countdownSeconds = 60 - intervalElapsed;
                document.body.style.backgroundColor = "#90EE90"; // Lighter green shade
                messageElement.textContent = `Place orders now. ${countdownSeconds} seconds left to place orders.`;
            } else if (intervalElapsed >= 120) {
                const countdownSeconds = 60 - (intervalElapsed - 120);
                document.body.style.backgroundColor = "orange";
                messageElement.textContent = `Fulfill orders now. ${countdownSeconds} seconds left to fulfill orders.`;
            } else {
                document.body.style.backgroundColor = "#f0f0f0"; // Default background color
                messageElement.textContent = "Do not place or fulfill orders.";
            }
        } else if (elapsed < totalPreDemoDuration) {
            // Pause
            const timeInPause = elapsed - setupDuration;
            const pauseMinutes = String(Math.floor(timeInPause / 60)).padStart(2, '0');
            const pauseSeconds = String(timeInPause % 60).padStart(2, '0');

            titleElement.textContent = "Pause";
            intervalTimerElement.style.display = "none";
            intervalCounterElement.style.display = "none";
            messageElement.style.display = "none";
            timeInSetupElement.style.display = "none";
            timeInPauseElement.style.display = "block";
            timeInDemoElement.style.display = "none";

            timeInPauseElement.textContent = `Time in Pause: ${pauseMinutes}:${pauseSeconds}`;
            document.body.style.backgroundColor = "#f0f0f0"; // Default background color

            const countdown = totalPreDemoDuration - elapsed;
            if (countdown <= 30) {
                countdownElement.style.color = "white";
                countdownElement.textContent = `Demo starts in ${countdown} seconds`;
            }
        } else {
            // Demo Time (after 11 minutes)
            const timeInDemo = elapsed - totalPreDemoDuration;
            const demoMinutes = String(Math.floor(timeInDemo / 60)).padStart(2, '0');
            const demoSeconds = String(timeInDemo % 60).padStart(2, '0');

            titleElement.textContent = "Demo";
            intervalTimerElement.style.display = "block";
            intervalCounterElement.style.display = "block";
            messageElement.style.display = "block";
            timeInSetupElement.style.display = "none";
            timeInPauseElement.style.display = "none";
            timeInDemoElement.style.display = "block";

            timeInDemoElement.textContent = `Time in Demo: ${demoMinutes}:${demoSeconds}`;

            const intervalElapsed = timeInDemo % 180;
            const remaining = 180 - intervalElapsed;
            const intervalMinutes = String(Math.floor(remaining / 60)).padStart(2, '0');
            const intervalSeconds = String(remaining % 60).padStart(2, '0');
            intervalTimerElement.textContent = `Time Left in 3-Minute Interval: ${intervalMinutes}:${intervalSeconds}`;

            const intervalCount = Math.floor(timeInDemo / 180) + 1;
            intervalCounterElement.textContent = `Interval Number: ${intervalCount}`;

            if (intervalElapsed < 60) {
                const countdownSeconds = 60 - intervalElapsed;
                document.body.style.backgroundColor = "#90EE90"; // Lighter green shade
                messageElement.textContent = `Place orders now. ${countdownSeconds} seconds left to place orders.`;
            } else if (intervalElapsed >= 120) {
                const countdownSeconds = 60 - (intervalElapsed - 120);
                document.body.style.backgroundColor = "orange";
                messageElement.textContent = `Fulfill orders now. ${countdownSeconds} seconds left to fulfill orders.`;
            } else {
                document.body.style.backgroundColor = "#f0f0f0"; // Default background color
                messageElement.textContent = "Do not place or fulfill orders.";
            }
        }
    }

    setInterval(updateTime, 1000);
}


