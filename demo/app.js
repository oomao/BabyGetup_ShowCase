// ===== BabyGetUp Live Demo — App Logic =====

// State
let currentScreen = 'screen-splash';
let videoCallTimer = null;
let videoCallSeconds = 0;
let sensorInterval = null;

// ===== Navigation =====
function navigateTo(screenId) {
    const prev = document.querySelector('.screen.active');
    const next = document.getElementById(screenId);
    if (!next || next === prev) return;

    // Close any open drawers
    document.querySelectorAll('.drawer.open').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.drawer-overlay.open').forEach(d => d.classList.remove('open'));

    if (prev) {
        prev.style.opacity = '0';
        setTimeout(() => {
            prev.classList.remove('active');
            prev.style.display = 'none';
            showScreen(next, screenId);
        }, 200);
    } else {
        showScreen(next, screenId);
    }
}

function showScreen(el, screenId) {
    el.style.display = 'flex';
    requestAnimationFrame(() => {
        el.classList.add('active');
        el.style.opacity = '1';
    });
    currentScreen = screenId;
    updateNavButtons(screenId);

    // Lifecycle
    if (screenId === 'screen-video-call') startVideoTimer();
    else stopVideoTimer();

    if (screenId === 'screen-parent-home' || screenId === 'screen-child-home') startSensorSim();
    else stopSensorSim();
}

function quickNav(screenId) {
    navigateTo(screenId);
}

function updateNavButtons(screenId) {
    document.querySelectorAll('.screen-nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.screen === screenId);
    });
}

// ===== Splash auto-transition =====
function startDemo() {
    document.getElementById('landing').style.display = 'none';
    document.getElementById('phone-wrapper').classList.remove('hidden');
    updateClock();
    // Auto-advance from splash to welcome after 2s
    setTimeout(() => navigateTo('screen-welcome'), 2000);
}

// ===== Login flow =====
function doLogin() {
    const btn = document.querySelector('#screen-login .m3-btn-filled');
    btn.textContent = '連線中…';
    btn.style.opacity = '0.7';
    setTimeout(() => {
        btn.textContent = '登入';
        btn.style.opacity = '1';
        showToast('登入成功');
        navigateTo('screen-mode-choice');
    }, 1200);
}

// ===== Drawer =====
function toggleDrawer(role) {
    const drawer = document.getElementById('drawer-' + role);
    const overlay = document.getElementById('drawer-overlay-' + role);
    if (drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
    } else {
        drawer.classList.add('open');
        overlay.classList.add('open');
    }
}

// ===== Video Call =====
function startVideoTimer() {
    videoCallSeconds = 0;
    updateVideoUI();
    videoCallTimer = setInterval(() => {
        videoCallSeconds++;
        updateVideoUI();
    }, 1000);
}

function stopVideoTimer() {
    if (videoCallTimer) { clearInterval(videoCallTimer); videoCallTimer = null; }
}

function updateVideoUI() {
    const h = String(Math.floor(videoCallSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((videoCallSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(videoCallSeconds % 60).padStart(2, '0');
    const dur = document.getElementById('video-duration');
    if (dur) dur.textContent = `${h}:${m}:${s}`;

    // Simulated network rate
    const rate = document.getElementById('video-rate');
    if (rate) rate.textContent = `${(Math.random() * 800 + 200).toFixed(0)} Kbps`;
}

function toggleMic() {
    const btn = document.getElementById('btn-mic');
    const icon = btn.querySelector('.material-icons-round');
    if (icon.textContent === 'mic') {
        icon.textContent = 'mic_off';
        btn.classList.add('off');
        showToast('靜音');
    } else {
        icon.textContent = 'mic';
        btn.classList.remove('off');
        showToast('取消靜音');
    }
}

function toggleCam() {
    const btn = document.getElementById('btn-cam');
    const icon = btn.querySelector('.material-icons-round');
    if (icon.textContent === 'videocam') {
        icon.textContent = 'videocam_off';
        btn.classList.add('off');
        showToast('關閉鏡頭');
    } else {
        icon.textContent = 'videocam';
        btn.classList.remove('off');
        showToast('開啟鏡頭');
    }
}

function hangUp() {
    showToast('結束視訊通話');
    stopVideoTimer();
    navigateTo('screen-parent-home');
}

// ===== Sensor Simulation =====
function startSensorSim() {
    updateSensorData();
    sensorInterval = setInterval(updateSensorData, 3000);
}

function stopSensorSim() {
    if (sensorInterval) { clearInterval(sensorInterval); sensorInterval = null; }
}

function updateSensorData() {
    const temp = (35.5 + Math.random() * 2).toFixed(1);
    const battery = Math.floor(75 + Math.random() * 20);
    const states = [
        { text: '睡著', cls: 'status-sleep' },
        { text: '睡醒', cls: 'status-awake' },
        { text: '離床', cls: 'status-outbed' }
    ];
    const state = states[Math.floor(Math.random() * states.length)];

    // Parent
    const pt = document.getElementById('parent-temp');
    const pb = document.getElementById('parent-battery');
    const ps = document.getElementById('parent-state');
    if (pt) { pt.textContent = temp + '°C'; animateValue(pt); }
    if (pb) { pb.textContent = battery + '%'; animateValue(pb); }
    if (ps) { ps.textContent = state.text; ps.className = 'info-value ' + state.cls; animateValue(ps); }

    // Child
    const ct = document.getElementById('child-temp');
    const cb = document.getElementById('child-battery');
    const cs = document.getElementById('child-state');
    if (ct) { ct.textContent = temp + '°C'; animateValue(ct); }
    if (cb) { cb.textContent = battery + '%'; animateValue(cb); }
    if (cs) { cs.textContent = state.text; cs.className = 'info-value ' + state.cls; animateValue(cs); }
}

function animateValue(el) {
    el.style.transition = 'none';
    el.style.transform = 'scale(1.15)';
    el.style.color = '#5E90FF';
    setTimeout(() => {
        el.style.transition = 'all .4s';
        el.style.transform = 'scale(1)';
        // restore class color
        setTimeout(() => { el.style.color = ''; }, 400);
    }, 100);
}

function refreshData() {
    showToast('重新整理中…');
    updateSensorData();
}

// ===== Toast =====
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// ===== Clock =====
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const el = document.getElementById('status-time');
    if (el) el.textContent = `${h}:${m}`;
    setTimeout(updateClock, 30000);
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
});
