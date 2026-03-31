// Basic Upgrade script.js
// Features: predict on button or live while typing, reset, accessible updates, alarm control

const tempEl = document.getElementById('temp');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const resultEl = document.getElementById('result');
const explainEl = document.getElementById('explain');
const alarm = document.getElementById('alarm-sound');
const predictBtn = document.getElementById('predict-btn');
const resetBtn = document.getElementById('reset-btn');
const body = document.body;

function formatScore(score) {
  return Math.max(0, Math.min(100, score)).toFixed(1);
}

function predictFire() {
  const temp = parseFloat(tempEl.value);
  const humidity = parseFloat(humidityEl.value);
  const wind = parseFloat(windEl.value);

  // Validation
  if (isNaN(temp) || isNaN(humidity) || isNaN(wind)) {
    resultEl.textContent = "⚠️ Please fill all fields with valid numbers!";
    explainEl.textContent = "Temperature, humidity, and wind speed are required.";
    body.className = 'safe-mode';
    stopAlarm();
    return;
  }

  // Fire risk calculation
  let fireRisk = 0;
  fireRisk += Math.max(0, temp - 15) * 1.2;
  fireRisk += (100 - humidity) * 0.25;
  fireRisk += wind * 0.6;

  body.classList.remove('safe-mode', 'medium-mode', 'fire-mode');

  if (fireRisk >= 60) {
    body.classList.add('fire-mode');
    resultEl.textContent = `🔥 HIGH FIRE RISK (Score: ${formatScore(fireRisk)}%)`;
    explainEl.textContent = "Very dangerous conditions. Take immediate action.";
    playAlarm();
  } 
  else if (fireRisk >= 30) {
    body.classList.add('medium-mode');
    resultEl.textContent = `⚠️ MODERATE FIRE RISK (Score: ${formatScore(fireRisk)}%)`;
    explainEl.textContent = "Be alert. Avoid open flames.";
    stopAlarm();
  } 
  else {
    body.classList.add('safe-mode');
    resultEl.textContent = `✅ LOW FIRE RISK (Score: ${formatScore(fireRisk)}%)`;
    explainEl.textContent = "Conditions are safe for now.";
    stopAlarm();
  }

  console.log("Fire Risk:", fireRisk);
}

function playAlarm() {
  if (alarm.paused) {
    alarm.currentTime = 0;
    alarm.play().catch(() => {});
  }
}

function stopAlarm() {
  alarm.pause();
  alarm.currentTime = 0;
}

function resetForm() {
  tempEl.value = "";
  humidityEl.value = "";
  windEl.value = "";
  resultEl.textContent = "Status: Waiting for input...";
  explainEl.textContent = "Enter values to predict fire risk.";
  body.className = 'safe-mode';
  stopAlarm();
}

predictBtn.addEventListener('click', predictFire);
resetBtn.addEventListener('click', resetForm);

// Live prediction (debounced)
let debounceTimer;
[tempEl, humidityEl, windEl].forEach(el => {
  el.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(predictFire, 400);
  });
});

document.getElementById('input-form').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    predictFire();
  }
});
