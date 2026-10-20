/* ===================================================================
   BODA GLENIS & ELVIS - LÓGICA INTERACTIVA (app.js)
   =================================================================== */

// Configuración de los novios (fácilmente personalizable)
const WEDDING_CONFIG = {
  brideName: "Glenis",
  groomName: "Elvis",
  weddingDate: new Date("2026-11-14T11:30:00-05:00"), // 14 Nov 2026, 11:30 AM (Hora Perú GMT-5)
  // Reemplaza este número con el número de WhatsApp real de los novios (formato internacional sin '+' ni espacios, ej: 51987654321)
  whatsappNumber: "51987654321", 
  googleCalendarUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda+de+Glenis+%26+Elvis&dates=20261114T163000Z/20261115T050000Z&details=Acomp%C3%A1%C3%B1anos+a+celebrar+nuestra+boda+en+Cusco.+Ceremonia+en+Convento+de+La+Merced+y+Recepci%C3%B3n+en+Villa+Novios+Saylla.&location=Convento+de+La+Merced%2C+Calle+Mantas+121%2C+Cusco",
};

// -------------------------------------------------------------
// 1. Apertura de Sobre / Pantalla de Bienvenida (Flujo Cinemático)
// -------------------------------------------------------------
// Configuración del Sobre:
// - mode: 'corona' (Corona Superior: video 16:9 y tarjeta posándose arriba a los 7.4s)
//         'zoom'   (Modo Enfoque Zoom: relación 4:4.8 centrada en el sobre)
// - triggerTime: 7.4 (segundos exactos del video en que emerge la tarjeta)
const ENVELOPE_CONFIG = {
  mode: 'corona',     // 'corona' (activo) o 'zoom' (disponible en cualquier momento)
  triggerTime: 7.4,   // 7.4 segundos exactos
};

let isEnvelopeOpen = false;
let isEnvelopeVideoStarted = false;

// Asegurar que el sobre empiece 100% cerrado y esperando el toque del sello
function initEnvelopeState() {
  isEnvelopeOpen = false;
  isEnvelopeVideoStarted = false;
  const envelopeScreen = document.getElementById("envelopeScreen");
  const stageWrapper = document.getElementById("stageWrapper");
  const sealButton = document.getElementById("sealButtonContainer");
  const envelopeVideo = document.getElementById("envelopeVideo");
  const instructionText = document.getElementById("instructionText");
  const introHeader = document.getElementById("introHeader");

  if (envelopeScreen) envelopeScreen.classList.remove("card-is-active");
  if (stageWrapper) stageWrapper.classList.remove("card-is-active");
  if (sealButton) sealButton.classList.remove("seal-opened");
  if (introHeader) introHeader.classList.remove("header-full-disappear");
  if (instructionText) {
    instructionText.classList.add("hidden");
    instructionText.innerText = "";
  }
  if (envelopeVideo) {
    try {
      envelopeVideo.pause();
      envelopeVideo.currentTime = 0;
    } catch(e) {}
  }
}

// Función para cambiar de modo dinámicamente en cualquier momento sin tocar el HTML
function setEnvelopeMode(mode) {
  const envelopeScreen = document.getElementById("envelopeScreen");
  if (!envelopeScreen) return;
  if (mode === 'zoom') {
    envelopeScreen.classList.remove('mode-cine-3');
    envelopeScreen.classList.remove('envelope-mode-corona');
    envelopeScreen.classList.add('mode-zoom');
    envelopeScreen.classList.add('envelope-mode-zoom');
    ENVELOPE_CONFIG.mode = 'zoom';
  } else {
    envelopeScreen.classList.remove('mode-zoom');
    envelopeScreen.classList.remove('envelope-mode-zoom');
    envelopeScreen.classList.add('mode-cine-3');
    envelopeScreen.classList.add('envelope-mode-corona');
    ENVELOPE_CONFIG.mode = 'corona';
  }
}

function handleEnvelopeTilt(e) {
  // Tilt desactivado para mantener el video horizontal estable
}

function resetEnvelopeTilt() {
}

function playEnvelopeChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.08 + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + index * 0.08);
      osc.stop(ctx.currentTime + index * 0.08 + 0.85);
    });
  } catch (err) {}
}

function onViewportClick(e) {
  if (isEnvelopeVideoStarted) return;
  const sealButton = document.getElementById("sealButtonContainer");
  if (sealButton && !sealButton.classList.contains("seal-opened")) {
    openEnvelopeAnimation(e);
  }
}

function openEnvelopeAnimation(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  if (isEnvelopeVideoStarted) return;
  isEnvelopeVideoStarted = true;
  
  const envelopeScreen = document.getElementById("envelopeScreen");
  const stageWrapper = document.getElementById("stageWrapper");
  const introHeader = document.getElementById("introHeader");
  const instructionText = document.getElementById("instructionText");
  const sealButton = document.getElementById("sealButtonContainer");
  const envelopeVideo = document.getElementById("envelopeVideo");

  // 1. Ocultar inmediatamente el sello interactivo para revelar el auténtico sello del video
  if (sealButton) {
    sealButton.classList.add("seal-opened");
  }

  // 2. Efecto armónico sutil al pulsar
  playEnvelopeChime();

  // Función interna para revelar la tarjeta web al llegar al segundo configurado
  let cardHasRevealed = false;
  const revealInvitationCard = () => {
    if (cardHasRevealed) return;
    cardHasRevealed = true;
    isEnvelopeOpen = true;

    if (envelopeScreen) {
      envelopeScreen.classList.add("card-is-active");
    }
    if (stageWrapper) {
      stageWrapper.classList.add("card-is-active");
    }
    if (introHeader) {
      introHeader.classList.add("header-full-disappear");
    }
    if (instructionText) {
      instructionText.innerText = "✨ ¡Sobre abierto! Toca 'VER INVITACIÓN COMPLETA' para continuar";
      instructionText.classList.remove("animate-pulse");
      instructionText.classList.remove("hidden");
    }
  };

  // 3. Reproducir video y sincronizar salida de tarjeta exactamente con el video
  if (envelopeVideo) {
    // Si el video ya está en 0, no forzar un seek innecesario que pueda pausar el motor
    if (envelopeVideo.currentTime !== 0) {
      envelopeVideo.currentTime = 0;
    }
    
    const playPromise = envelopeVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn("Reproducción de video de sobre:", err);
      });
    }

    const triggerSec = (typeof ENVELOPE_CONFIG !== 'undefined' && ENVELOPE_CONFIG.triggerTime) ? ENVELOPE_CONFIG.triggerTime : 7.4;

    // Escucha en tiempo real del progreso del video (solo se revela cuando el video avanza)
    const onVideoProgress = () => {
      if (envelopeVideo.currentTime >= triggerSec) {
        revealInvitationCard();
        envelopeVideo.removeEventListener("timeupdate", onVideoProgress);
      }
    };
    envelopeVideo.addEventListener("timeupdate", onVideoProgress);

    // Si el video finaliza, asegurar despliegue de la tarjeta
    envelopeVideo.addEventListener("ended", () => {
      revealInvitationCard();
    }, { once: true });

  } else {
    revealInvitationCard();
  }
}

function enterWebsite() {
  // Pausar video del sobre si continúa reproduciéndose
  const envelopeVideo = document.getElementById("envelopeVideo");
  if (envelopeVideo) {
    try {
      envelopeVideo.pause();
    } catch(e) {}
  }

  const modal = document.getElementById("welcome-modal");
  if (modal) {
    modal.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    modal.style.opacity = "0";
    modal.style.transform = "scale(1.04)";
    setTimeout(() => {
      modal.classList.add("hidden-modal");
      modal.style.display = "none";
    }, 800);
  }
  // RECIÉN AQUÍ: Iniciar la canción de los novios
  playAudioSafely();
  // Lanzar lluvia de confeti dorado
  triggerGoldenConfetti();
  // Iniciar caída sutil de pétalos
  startPetals();
}

// Compatibilidad en caso de llamada externa
function openInvitation() {
  if (!isEnvelopeOpen) {
    openEnvelopeAnimation();
  } else {
    enterWebsite();
  }
}

// -------------------------------------------------------------
// 2. Contador Regresivo en Tiempo Real
// -------------------------------------------------------------
function initCountdown() {
  const daysEl = document.getElementById("countdown-days");
  const hoursEl = document.getElementById("countdown-hours");
  const minutesEl = document.getElementById("countdown-minutes");
  const secondsEl = document.getElementById("countdown-seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function update() {
    const now = new Date().getTime();
    const target = WEDDING_CONFIG.weddingDate.getTime();
    const distance = target - now;

    if (distance < 0) {
      daysEl.innerText = "00";
      hoursEl.innerText = "00";
      minutesEl.innerText = "00";
      secondsEl.innerText = "00";
      const statusText = document.getElementById("countdown-status");
      if (statusText) statusText.innerText = "¡Hoy es nuestro gran día!";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.innerText = String(days).padStart(2, "0");
    hoursEl.innerText = String(hours).padStart(2, "0");
    minutesEl.innerText = String(minutes).padStart(2, "0");
    secondsEl.innerText = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

/// -------------------------------------------------------------
// 3. Reproductor de Música: "Tienes La Magia" - Lil Silvio & El Vega
// -------------------------------------------------------------
let isPlaying = false;
let audioContext = null;
let synthInterval = null;

function sendYouTubeCommand(func, args = "") {
  const iframe = document.getElementById("yt-music-frame");
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage(JSON.stringify({
      event: "command",
      func: func,
      args: args ? [args] : []
    }), "*");
  }
}

function playAudioSafely() {
  const audioElement = document.getElementById("wedding-audio");
  if (audioElement) {
    audioElement.muted = false;
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isPlaying = true;
        updateMusicUI(true);
      }).catch((err) => {
        console.warn("Autoplay prevenido por el navegador móvil:", err);
        sendYouTubeCommand("playVideo");
      });
    }
  } else {
    sendYouTubeCommand("playVideo");
  }
}

function toggleMusic(forcePlay = false) {
  const audioElement = document.getElementById("wedding-audio");

  if (!forcePlay && isPlaying) {
    // Pausar canción
    sendYouTubeCommand("pauseVideo");
    if (audioElement) audioElement.pause();
    stopAmbientSynth();
    isPlaying = false;
    updateMusicUI(false);
    showToast("Canción en pausa ⏸️");
  } else {
    // Reproducir canción
    playAudioSafely();
    showToast("Música activada 🎶");
  }
}

function updateMusicUI(active) {
  const musicBtn = document.getElementById("music-toggle-btn");
  const musicIcon = document.getElementById("music-icon");
  const inlinePlayBtn = document.getElementById("inline-play-btn");

  if (musicBtn && musicIcon) {
    if (active) {
      musicBtn.classList.add("playing");
      musicIcon.innerHTML = `<path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>`;
    } else {
      musicBtn.classList.remove("playing");
      musicIcon.innerHTML = `<line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v9"></path><circle cx="6" cy="18" r="3"></circle><path d="M12 5l9-2v9"></path><circle cx="18" cy="16" r="3"></circle>`;
    }
  }

  if (inlinePlayBtn) {
    if (active) {
      inlinePlayBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
      inlinePlayBtn.title = "Pausar música";
    } else {
      inlinePlayBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
      inlinePlayBtn.title = "Reproducir música";
    }
  }
}

function toggleLike(btn) {
  btn.classList.toggle("liked");
  const isLiked = btn.classList.contains("liked");
  if (isLiked) {
    btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="#e53e3e" stroke="#e53e3e" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
    showToast("¡Te gusta nuestra canción! ❤️");
  } else {
    btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
  }
}

function restartSong() {
  sendYouTubeCommand("seekTo", 0);
  const audioElement = document.getElementById("wedding-audio");
  if (audioElement) {
    audioElement.currentTime = 0;
  }
  if (!isPlaying) toggleMusic(true);
  showToast("Reproduciendo desde el inicio 🎶");
}

// Respaldo de sonido suave de arpa/piano con Web Audio API en caso no haya archivo mp3
function startAmbientSynth() {
  if (synthInterval) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    audioContext = new AudioCtx();
    
    // Progresión de acordes romántica estilo Canon de Pachelbel (D - A - Bm - F#m - G - D - G - A)
    const notes = [
      [293.66, 369.99, 440.00], // D major
      [220.00, 277.18, 329.63], // A major
      [246.94, 293.66, 369.99], // B minor
      [185.00, 220.00, 277.18], // F# minor
      [196.00, 246.94, 293.66], // G major
      [146.83, 220.00, 293.66], // D major
      [196.00, 246.94, 329.63], // G major
      [220.00, 277.18, 329.63]  // A major
    ];
    let chordIdx = 0;

    function playChord() {
      if (!audioContext || audioContext.state === 'suspended') {
        audioContext.resume();
      }
      const currentChord = notes[chordIdx];
      currentChord.forEach((freq, i) => {
        setTimeout(() => {
          if (!isPlaying) return;
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, audioContext.currentTime);

          gain.gain.setValueAtTime(0.04, audioContext.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 3.0);

          osc.connect(gain);
          gain.connect(audioContext.destination);

          osc.start();
          osc.stop(audioContext.currentTime + 3.0);
        }, i * 220);
      });
      chordIdx = (chordIdx + 1) % notes.length;
    }

    playChord();
    synthInterval = setInterval(playChord, 3600);
  } catch(e) {
    console.warn("Audio Context unavailable:", e);
  }
}

function stopAmbientSynth() {
  if (synthInterval) {
    clearInterval(synthInterval);
    synthInterval = null;
  }
}

// -------------------------------------------------------------
// 4. Copiar al Portapapeles con Notificación Toast
// -------------------------------------------------------------
function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`¡${label} copiado con éxito!`);
  }).catch(() => {
    // Fallback manual
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    showToast(`¡${label} copiado con éxito!`);
  });
}

function copyBankNumber(type) {
  let num = "";
  let label = "";
  if (type === 'cci' || type === 'bcp') {
    const el = document.getElementById("bank-bbva-number") || document.getElementById("bank-bcp-number");
    num = el ? el.textContent.trim().replace(/[^0-9]/g, '') : '01181400023858102315';
    label = "CCI BBVA";
  } else if (type === 'plin' || type === 'yape') {
    const el = document.getElementById("bank-plin-number") || document.getElementById("bank-yape-number");
    num = el ? el.textContent.trim().replace(/[^0-9]/g, '') : '952384007';
    label = "Número Plin";
  }
  copyToClipboard(num, label);
}

function showToast(message) {
  const toast = document.getElementById("toast-notification");
  const toastMsg = document.getElementById("toast-message");
  if (!toast || !toastMsg) return;

  toastMsg.innerText = message;
  toast.classList.add("show-toast");

  setTimeout(() => {
    toast.classList.remove("show-toast");
  }, 3200);
}

// -------------------------------------------------------------
// Control de Modales (RSVP y Buzón de Deseos)
// -------------------------------------------------------------
function openBankModal() {
  const el = document.getElementById("bank-bcp-number");
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function closeBankModal() {}

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbz8k-jWqNmZdOyRVB7EhtSBWk5Q7tP-mVh3NsTZ8p5PdI_LKnNFNslMsd2gLwKHip13gw/exec";

// Función asíncrona para registrar en Google Sheets (Apps Script)
async function sendToGoogleSheet(payload) {
  try {
    const response = await fetch(GOOGLE_SHEET_URL, {
      method: "POST",
      mode: "no-cors", // Evita preflight CORS en Google Apps Script
      headers: {
        "Content-Type": "text/plain"
      },
      body: JSON.stringify(payload)
    });
    return { success: true };
  } catch (error) {
    console.error("Error al registrar en Google Sheets:", error);
    return { success: false, error };
  }
}

// -------------------------------------------------------------
// Utilidades de Identificación de Invitado y Persistencia Local
// -------------------------------------------------------------
function getGuestId() {
  const params = new URLSearchParams(window.location.search);
  const paramId = params.get("id");
  if (paramId && paramId.trim()) {
    return paramId.trim();
  }
  const paramName = params.get("para") || params.get("invitado") || params.get("guest") || params.get("de") || "";
  if (paramName && paramName.trim()) {
    return "guest_" + paramName.trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
  }
  const input = document.getElementById("guest-name") || document.getElementById("wishes-author");
  const fallback = input ? input.value.trim() : "";
  return fallback ? "guest_" + fallback.toLowerCase().replace(/[^a-z0-9]/g, "_") : "invitado_general";
}

function getNormalizedGuestKey(rawName) {
  const gid = getGuestId();
  if (gid && gid !== "invitado_general") {
    return gid;
  }
  let name = rawName;
  if (!name) {
    const params = new URLSearchParams(window.location.search);
    name = params.get("para") || params.get("invitado") || params.get("guest") || params.get("de") || "";
  }
  if (!name) {
    const input = document.getElementById("guest-name") || document.getElementById("wishes-author");
    name = input ? input.value : "";
  }
  return name.trim().toLowerCase().replace(/[^a-z0-9]/g, "_") || "invitado_general";
}

// -------------------------------------------------------------
// Consulta en Tiempo Real a Google Sheets (JSONP + Fetch)
// -------------------------------------------------------------
function queryGoogleSheet(action, guestName) {
  return new Promise((resolve) => {
    const guestId = getGuestId();
    if (!guestName && !guestId) {
      resolve({ exists: false, empty: true });
      return;
    }
    const callbackName = "gas_cb_" + Math.random().toString(36).substring(2, 10);
    let resolved = false;

    // Timeout seguro de 5 segundos
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve({ timeout: true });
      }
    }, 5000);

    function cleanup() {
      clearTimeout(timer);
      try { delete window[callbackName]; } catch (e) { window[callbackName] = undefined; }
      const oldScript = document.getElementById(callbackName);
      if (oldScript && oldScript.parentNode) {
        oldScript.parentNode.removeChild(oldScript);
      }
    }

    window[callbackName] = function(data) {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve(data);
      }
    };

    const script = document.createElement("script");
    script.id = callbackName;
    script.onerror = function() {
      if (!resolved) {
        resolved = true;
        cleanup();
        // Fallback vía fetch
        const fetchUrl = `${GOOGLE_SHEET_URL}?action=${encodeURIComponent(action)}&invitado=${encodeURIComponent(guestName || "")}&id=${encodeURIComponent(guestId)}&t=${Date.now()}`;
        fetch(fetchUrl)
          .then(r => r.json())
          .then(data => resolve(data))
          .catch(err => resolve({ error: err }));
      }
    };

    const url = `${GOOGLE_SHEET_URL}?action=${encodeURIComponent(action)}&invitado=${encodeURIComponent(guestName || "")}&id=${encodeURIComponent(guestId)}&callback=${callbackName}&t=${Date.now()}`;
    script.src = url;
    document.body.appendChild(script);
  });
}

// Sincronización bidireccional en vivo: Si la fila fue borrada en Google Sheets, limpia la memoria local y reabre el formulario
async function syncWithGoogleSheet(rawName) {
  const titular = rawName || document.getElementById("guest-name")?.value.trim() || "";
  if (!titular) return;
  const guestKey = getNormalizedGuestKey(titular);

  try {
    const data = await queryGoogleSheet("check_all", titular);
    if (!data || data.timeout || data.error) {
      return; // Mantener caché local ante problemas de red
    }

    // 1. Sincronizar RSVP con el Excel
    if (data.rsvp) {
      const mainBtnText = document.getElementById("rsvp-main-btn-text");
      if (data.rsvp.exists === false) {
        // La fila fue borrada en el Excel: Desbloquear inmediatamente
        localStorage.removeItem("wedding_rsvp_" + guestKey);
        if (mainBtnText) mainBtnText.textContent = "CONFIRMAR";

        const modal = document.getElementById("rsvp-modal");
        if (modal && !modal.classList.contains("hidden")) {
          showCleanRSVPForm();
        }
      } else if (data.rsvp.exists === true) {
        // La fila existe en el Excel: Guardar y mostrar su estado real
        const attendanceVal = data.rsvp.asistencia && data.rsvp.asistencia.includes("SÍ") ? "yes" : "no";
        const rsvpObj = {
          attendance: attendanceVal,
          pases: String(data.rsvp.pases || "1"),
          titular: titular,
          companion: data.rsvp.companion || "",
          asistentes: data.rsvp.asistentes || titular,
          timestamp: data.rsvp.timestamp || new Date().toLocaleString()
        };
        localStorage.setItem("wedding_rsvp_" + guestKey, JSON.stringify(rsvpObj));

        if (mainBtnText) {
          mainBtnText.textContent = attendanceVal === "yes" ? "ASISTENCIA CONFIRMADA 🥂" : "RESPUESTA REGISTRADA 🕊️";
        }

        const modal = document.getElementById("rsvp-modal");
        if (modal && !modal.classList.contains("hidden")) {
          renderRSVPSavedState(rsvpObj);
        }
      }
    }

    // 2. Sincronizar Buzón de Deseos con el Excel
    if (data.wish) {
      const form = document.getElementById("wishes-form");
      const alreadyCard = document.getElementById("wishes-already-sent-card");
      const successCard = document.getElementById("wishes-success-card");
      const authorSpan = document.getElementById("wishes-already-author");
      const textSpan = document.getElementById("wishes-already-text");

      if (data.wish.exists === false) {
        // Si borraron el deseo en el Excel, reactivar el formulario
        localStorage.removeItem("wedding_wish_" + guestKey);
        if (alreadyCard) alreadyCard.classList.add("hidden");
        if (successCard) successCard.classList.add("hidden");
        if (form) form.classList.remove("hidden");
      } else if (data.wish.exists === true) {
        const wishObj = {
          author: titular,
          wish: data.wish.mensaje || "",
          timestamp: data.wish.timestamp || new Date().toLocaleString()
        };
        localStorage.setItem("wedding_wish_" + guestKey, JSON.stringify(wishObj));

        if (form) form.classList.add("hidden");
        if (successCard) successCard.classList.add("hidden");
        if (alreadyCard) {
          alreadyCard.classList.remove("hidden");
          if (authorSpan) authorSpan.textContent = titular;
          if (textSpan) textSpan.textContent = data.wish.mensaje || "";
        }
      }
    }
  } catch (err) {
    console.warn("Error sincronizando con Google Sheets:", err);
  }
}

// Renderizar formulario interactivo limpio
function showCleanRSVPForm() {
  const formElement = document.getElementById("rsvp-form-element");
  const alreadyYes = document.getElementById("rsvp-already-yes");
  const alreadyNo = document.getElementById("rsvp-already-no");
  const successYes = document.getElementById("rsvp-success-yes");
  const successNo = document.getElementById("rsvp-success-no");
  const modalTitle = document.getElementById("rsvp-modal-title");
  const modalSubtitle = document.getElementById("rsvp-modal-subtitle");
  const submitBtnText = document.getElementById("rsvp-btn-text");

  if (alreadyYes) alreadyYes.classList.add("hidden");
  if (alreadyNo) alreadyNo.classList.add("hidden");
  if (successYes) successYes.classList.add("hidden");
  if (successNo) successNo.classList.add("hidden");
  if (formElement) formElement.classList.remove("hidden");

  if (modalTitle) modalTitle.textContent = "Confirmar Asistencia";
  if (modalSubtitle) modalSubtitle.textContent = "Tu respuesta se guardará automáticamente en la lista de los novios";
  if (submitBtnText) submitBtnText.innerHTML = "CONFIRMAR ASISTENCIA 🥂";

  // Restablecer selección "Sí asistiré" por defecto
  const yesRadio = document.querySelector('input[name="attendance"][value="yes"]');
  if (yesRadio) yesRadio.checked = true;
  toggleAttendanceFields("yes");
  updateAttendeeInputFields();
}

// Renderizar tarjeta de respuesta previa (Sí o No)
function renderRSVPSavedState(savedData) {
  const formElement = document.getElementById("rsvp-form-element");
  const alreadyYes = document.getElementById("rsvp-already-yes");
  const alreadyNo = document.getElementById("rsvp-already-no");
  const modalTitle = document.getElementById("rsvp-modal-title");
  const modalSubtitle = document.getElementById("rsvp-modal-subtitle");
  const titular = document.getElementById("guest-name")?.value.trim() || "";

  if (savedData.attendance === "no") {
    if (formElement) formElement.classList.add("hidden");
    if (alreadyYes) alreadyYes.classList.add("hidden");
    if (alreadyNo) {
      alreadyNo.classList.remove("hidden");
      const noTitular = document.getElementById("already-no-titular");
      if (noTitular) noTitular.textContent = savedData.titular || titular || "amigo(a)";
    }
    if (modalTitle) modalTitle.textContent = "Respuesta Registrada";
    if (modalSubtitle) modalSubtitle.textContent = "Agradecemos enormemente tu confirmación";
  } else {
    if (formElement) formElement.classList.add("hidden");
    if (alreadyNo) alreadyNo.classList.add("hidden");
    if (alreadyYes) {
      alreadyYes.classList.remove("hidden");
      const yesTitular = document.getElementById("already-yes-titular");
      const yesPasses = document.getElementById("already-yes-passes");
      const yesAttendees = document.getElementById("already-yes-attendees");
      if (yesTitular) yesTitular.textContent = savedData.titular || titular || "amigo(a)";
      if (yesPasses) yesPasses.textContent = `${savedData.pases} ${savedData.pases === "1" ? "pase confirmado" : "pases confirmados"}`;
      if (yesAttendees) yesAttendees.textContent = savedData.asistentes || savedData.titular;
    }
    if (modalTitle) modalTitle.textContent = "Asistencia Confirmada";
    if (modalSubtitle) modalSubtitle.textContent = "Tu lugar está reservado en nuestra boda";
  }
}

// Verificar si el invitado ya tiene registros previos en localStorage y sincronizar en vivo
function checkExistingSubmissions() {
  const titular = document.getElementById("guest-name")?.value.trim() || "";
  const guestKey = getNormalizedGuestKey(titular);
  const guestDisplay = titular || "Invitado(a)";

  // 1. Revisar estado local rápido del Buzón de Deseos
  try {
    const savedWish = localStorage.getItem("wedding_wish_" + guestKey);
    if (savedWish) {
      const wishData = JSON.parse(savedWish);
      const form = document.getElementById("wishes-form");
      const alreadyCard = document.getElementById("wishes-already-sent-card");
      const successCard = document.getElementById("wishes-success-card");
      const authorSpan = document.getElementById("wishes-already-author");
      const textSpan = document.getElementById("wishes-already-text");

      if (form) form.classList.add("hidden");
      if (successCard) successCard.classList.add("hidden");
      if (alreadyCard) {
        alreadyCard.classList.remove("hidden");
        if (authorSpan) authorSpan.textContent = wishData.author || guestDisplay;
        if (textSpan) textSpan.textContent = wishData.wish || "";
      }
    }
  } catch (e) {
    console.warn("Error al verificar deseo previo:", e);
  }

  // 2. Revisar estado local rápido de Confirmación de Asistencia (RSVP)
  try {
    const savedRSVP = localStorage.getItem("wedding_rsvp_" + guestKey);
    const mainBtnText = document.getElementById("rsvp-main-btn-text");
    if (savedRSVP) {
      const rsvpData = JSON.parse(savedRSVP);
      if (mainBtnText) {
        if (rsvpData.attendance === "yes") {
          mainBtnText.textContent = "ASISTENCIA CONFIRMADA 🥂";
        } else {
          mainBtnText.textContent = "RESPUESTA REGISTRADA 🕊️";
        }
      }
    } else {
      if (mainBtnText) mainBtnText.textContent = "CONFIRMAR";
    }
  } catch (e) {
    console.warn("Error al verificar RSVP previo:", e);
  }

  // 3. Sincronizar en vivo con Google Sheets (origen de la verdad)
  syncWithGoogleSheet(titular);
}

// -------------------------------------------------------------
// Control del Modal de Confirmación de Asistencia (RSVP)
// -------------------------------------------------------------
function openRSVPModal() {
  const modal = document.getElementById("rsvp-modal");
  if (!modal) return;
  modal.classList.remove("hidden");

  const titular = document.getElementById("guest-name")?.value.trim() || "";
  const guestKey = getNormalizedGuestKey(titular);

  let savedData = null;
  try {
    const raw = localStorage.getItem("wedding_rsvp_" + guestKey);
    if (raw) savedData = JSON.parse(raw);
  } catch (e) {}

  const successYes = document.getElementById("rsvp-success-yes");
  const successNo = document.getElementById("rsvp-success-no");
  if (successYes) successYes.classList.add("hidden");
  if (successNo) successNo.classList.add("hidden");

  if (savedData) {
    renderRSVPSavedState(savedData);
  } else {
    showCleanRSVPForm();
  }

  // Siempre verificar en vivo con Google Sheets al abrir el modal (si se borró en el Excel, cambia al formulario limpio)
  syncWithGoogleSheet(titular);
}

function closeRSVPModal() {
  const modal = document.getElementById("rsvp-modal");
  if (modal) modal.classList.add("hidden");
}

// Desbloquear el formulario para modificar datos del acompañante (Solo si dijo SÍ)
function enableRSVPEdit() {
  const formElement = document.getElementById("rsvp-form-element");
  const alreadyYes = document.getElementById("rsvp-already-yes");
  const successYes = document.getElementById("rsvp-success-yes");
  const modalTitle = document.getElementById("rsvp-modal-title");
  const modalSubtitle = document.getElementById("rsvp-modal-subtitle");
  const submitBtnText = document.getElementById("rsvp-btn-text");

  if (alreadyYes) alreadyYes.classList.add("hidden");
  if (successYes) successYes.classList.add("hidden");
  if (formElement) formElement.classList.remove("hidden");

  if (modalTitle) modalTitle.textContent = "Modificar Asistencia";
  if (modalSubtitle) modalSubtitle.textContent = "Puedes actualizar los datos de tu acompañante";
  if (submitBtnText) submitBtnText.innerHTML = "GUARDAR CAMBIOS 🥂";

  // Asegurar selección "Sí asistiré"
  const yesRadio = document.querySelector('input[name="attendance"][value="yes"]');
  if (yesRadio) yesRadio.checked = true;
  toggleAttendanceFields("yes");

  // Pre-cargar datos previos guardados
  const titular = document.getElementById("guest-name")?.value.trim() || "";
  const guestKey = getNormalizedGuestKey(titular);
  try {
    const raw = localStorage.getItem("wedding_rsvp_" + guestKey);
    if (raw) {
      const data = JSON.parse(raw);
      const select = document.getElementById("guest-count");
      if (select && data.pases) {
        select.value = data.pases;
      }
      updateAttendeeInputFields();

      const compInput = document.getElementById("companion-name");
      if (compInput && data.companion) {
        compInput.value = data.companion;
        compInput.focus();
      }
    }
  } catch (e) {}
}

// Alternar campos de asistencia en el modal RSVP
function toggleAttendanceFields(type) {
  const yesFields = document.getElementById("rsvp-yes-fields");
  const noFields = document.getElementById("rsvp-no-fields");
  const btnText = document.getElementById("rsvp-btn-text");
  const labelYes = document.getElementById("label-attendance-yes");
  const labelNo = document.getElementById("label-attendance-no");
  const inputsToToggle = ["companion-name", "companion-2-name", "companion-3-name", "guest-count"];

  if (type === "yes") {
    if (yesFields) yesFields.classList.remove("hidden");
    if (noFields) noFields.classList.add("hidden");
    if (btnText) btnText.innerHTML = "CONFIRMAR ASISTENCIA 🥂";

    inputsToToggle.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.disabled = false;
    });

    if (labelYes) {
      labelYes.className = "flex items-center gap-2 p-2.5 rounded-xl border-2 border-[#7e5877] bg-[#f7eff5] cursor-pointer text-xs font-semibold text-[#543550] transition-all";
    }
    if (labelNo) {
      labelNo.className = "flex items-center gap-2 p-2.5 rounded-xl border border-stone-300 bg-white cursor-pointer text-xs font-medium text-stone-600 transition-all";
    }
    updateAttendeeInputFields();
  } else {
    if (yesFields) yesFields.classList.add("hidden");
    if (noFields) noFields.classList.remove("hidden");
    if (btnText) btnText.innerHTML = "ENVIAR RESPUESTA 🕊️";

    inputsToToggle.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.disabled = true;
    });

    if (labelYes) {
      labelYes.className = "flex items-center gap-2 p-2.5 rounded-xl border border-stone-300 bg-white cursor-pointer text-xs font-medium text-stone-600 transition-all";
    }
    if (labelNo) {
      labelNo.className = "flex items-center gap-2 p-2.5 rounded-xl border-2 border-[#7e5877] bg-[#f7eff5] cursor-pointer text-xs font-semibold text-[#543550] transition-all";
    }
  }
}

// Mostrar/Ocultar campos de acompañante según el número de pases seleccionado
function updateAttendeeInputFields() {
  const select = document.getElementById("guest-count");
  if (!select) return;
  const count = parseInt(select.value, 10) || 1;

  const singleNote = document.getElementById("single-guest-note");
  const compGroup = document.getElementById("companion-group");
  const compInput = document.getElementById("companion-name");
  const comp2Group = document.getElementById("companion-2-group");
  const comp2Input = document.getElementById("companion-2-name");
  const comp3Group = document.getElementById("companion-3-group");
  const comp3Input = document.getElementById("companion-3-name");

  if (count === 1) {
    if (singleNote) singleNote.classList.remove("hidden");
    if (compGroup) compGroup.classList.add("hidden");
    if (compInput) { compInput.disabled = true; compInput.value = ""; }
    if (comp2Group) comp2Group.classList.add("hidden");
    if (comp2Input) { comp2Input.disabled = true; comp2Input.value = ""; }
    if (comp3Group) comp3Group.classList.add("hidden");
    if (comp3Input) { comp3Input.disabled = true; comp3Input.value = ""; }
  } else if (count === 2) {
    if (singleNote) singleNote.classList.add("hidden");
    if (compGroup) compGroup.classList.remove("hidden");
    if (compInput) compInput.disabled = false;
    if (comp2Group) comp2Group.classList.add("hidden");
    if (comp2Input) { comp2Input.disabled = true; comp2Input.value = ""; }
    if (comp3Group) comp3Group.classList.add("hidden");
    if (comp3Input) { comp3Input.disabled = true; comp3Input.value = ""; }
  } else if (count === 3) {
    if (singleNote) singleNote.classList.add("hidden");
    if (compGroup) compGroup.classList.remove("hidden");
    if (compInput) compInput.disabled = false;
    if (comp2Group) comp2Group.classList.remove("hidden");
    if (comp2Input) comp2Input.disabled = false;
    if (comp3Group) comp3Group.classList.add("hidden");
    if (comp3Input) { comp3Input.disabled = true; comp3Input.value = ""; }
  } else {
    // 4 o más pases
    if (singleNote) singleNote.classList.add("hidden");
    if (compGroup) compGroup.classList.remove("hidden");
    if (compInput) compInput.disabled = false;
    if (comp2Group) comp2Group.classList.remove("hidden");
    if (comp2Input) comp2Input.disabled = false;
    if (comp3Group) comp3Group.classList.remove("hidden");
    if (comp3Input) comp3Input.disabled = false;
  }
}

// -------------------------------------------------------------
// 5. Confirmación de Asistencia (RSVP) a Google Sheets
// -------------------------------------------------------------
async function handleRSVPSubmit(event) {
  if (event) event.preventDefault();

  const titularInput = document.getElementById("guest-name");
  const titular = titularInput ? titularInput.value.trim() : "";
  const attendanceRadio = document.querySelector('input[name="attendance"]:checked');
  const attendanceVal = attendanceRadio ? attendanceRadio.value : "yes";
  const submitBtn = document.getElementById("rsvp-submit-btn");
  const originalBtnContent = submitBtn ? submitBtn.innerHTML : "";

  if (!titular) {
    showToast("Por favor, ingresa tu nombre completo");
    if (titularInput) titularInput.focus();
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>GUARDANDO RESPUESTA... ⏳</span>`;
  }

  let pases = "0";
  let asistentes = "No asiste";
  let asistencia = "NO ASISTIRÁ";
  let companionName = "";

  if (attendanceVal === "yes") {
    asistencia = "SÍ ASISTIRÁ";
    const select = document.getElementById("guest-count");
    const count = select ? (parseInt(select.value, 10) || 1) : 1;
    pases = String(count);

    const names = [titular]; // El titular SIEMPRE es el Asistente 1 automáticamente

    if (count >= 2) {
      companionName = document.getElementById("companion-name")?.value.trim() || "";
      if (companionName) {
        names.push(companionName);
      } else {
        names.push(`${titular} (Pareja/Acompañante)`);
      }
    }
    if (count >= 3) {
      const c2 = document.getElementById("companion-2-name")?.value.trim() || "";
      if (c2) names.push(c2);
    }
    if (count >= 4) {
      const c3 = document.getElementById("companion-3-name")?.value.trim() || "";
      if (c3) names.push(c3);
    }

    asistentes = names.join(", ");
  }

  const guestKey = getNormalizedGuestKey(titular);
  const previouslyRegistered = localStorage.getItem("wedding_rsvp_" + guestKey);
  const tipoRegistro = previouslyRegistered ? "RSVP (Actualización)" : "RSVP";

  let savedWishText = "—";
  try {
    const rawWish = localStorage.getItem("wedding_wish_" + guestKey);
    if (rawWish) {
      const parsedWish = JSON.parse(rawWish);
      if (parsedWish && parsedWish.wish) savedWishText = parsedWish.wish;
    }
  } catch (e) {}

  const payload = {
    tipo: tipoRegistro,
    id: getGuestId(),
    invitado: titular,
    asistencia: asistencia,
    pases: pases,
    asistentes: asistentes,
    mensaje: savedWishText
  };

  try {
    await sendToGoogleSheet(payload);
  } catch (err) {
    console.error("Error al registrar RSVP:", err);
  }

  // Guardar estado en localStorage
  try {
    localStorage.setItem("wedding_rsvp_" + guestKey, JSON.stringify({
      attendance: attendanceVal,
      pases: pases,
      titular: titular,
      companion: companionName,
      asistentes: asistentes,
      timestamp: new Date().toLocaleString()
    }));
  } catch (e) {}

  // Actualizar botón de la portada/sección 5
  const mainBtnText = document.getElementById("rsvp-main-btn-text");
  if (mainBtnText) {
    mainBtnText.textContent = attendanceVal === "yes" ? "ASISTENCIA CONFIRMADA 🥂" : "RESPUESTA REGISTRADA 🕊️";
  }

  // Ocultar formulario
  const formElement = document.getElementById("rsvp-form-element");
  if (formElement) formElement.classList.add("hidden");

  // Mostrar tarjeta de confirmación correspondiente
  if (attendanceVal === "yes") {
    const successYes = document.getElementById("rsvp-success-yes");
    if (successYes) successYes.classList.remove("hidden");
    triggerGoldenConfetti();
    showToast("¡Asistencia confirmada con éxito! 🥂");
  } else {
    const successNo = document.getElementById("rsvp-success-no");
    if (successNo) successNo.classList.remove("hidden");
    showToast("Respuesta guardada. ¡Muchas gracias! 🕊️");
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnContent;
  }
}

// -------------------------------------------------------------
// 5.1. Buzón de Deseos a Google Sheets
// -------------------------------------------------------------
async function sendWishMessage(event) {
  if (event) event.preventDefault();

  const authorInput = document.getElementById("wishes-author");
  const textInput = document.getElementById("wishes-input");
  const author = authorInput ? authorInput.value.trim() : "";
  const wish = textInput ? textInput.value.trim() : "";
  const submitBtn = document.getElementById("wishes-submit-btn");

  if (!wish) {
    showToast("Por favor, escribe un deseo para los novios ✨");
    return;
  }

  const senderName = author || "Invitado";

  let originalBtnContent = "";
  if (submitBtn) {
    originalBtnContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>ENVIANDO... ⏳</span>`;
  }

  const guestKey = getNormalizedGuestKey(senderName);
  let savedRSVPAssist = "—";
  let savedRSVPPases = "—";
  let savedRSVPAssistentes = "—";
  try {
    const rawRSVP = localStorage.getItem("wedding_rsvp_" + guestKey);
    if (rawRSVP) {
      const parsedRSVP = JSON.parse(rawRSVP);
      if (parsedRSVP) {
        if (parsedRSVP.attendance === "yes") savedRSVPAssist = "SÍ ASISTIRÁ";
        else if (parsedRSVP.attendance === "no") savedRSVPAssist = "NO ASISTIRÁ";
        if (parsedRSVP.pases) savedRSVPPases = parsedRSVP.pases;
        if (parsedRSVP.asistentes) savedRSVPAssistentes = parsedRSVP.asistentes;
      }
    }
  } catch (e) {}

  const payload = {
    tipo: "BUZÓN",
    id: getGuestId(),
    invitado: senderName,
    asistencia: savedRSVPAssist,
    pases: savedRSVPPases,
    asistentes: savedRSVPAssistentes,
    mensaje: wish
  };

  await sendToGoogleSheet(payload);

  // Guardar en localStorage para este invitado
  try {
    localStorage.setItem("wedding_wish_" + guestKey, JSON.stringify({
      author: senderName,
      wish: wish,
      timestamp: new Date().toLocaleString()
    }));
  } catch (e) {}

  // Ocultar form y mostrar tarjeta bonita de agradecimiento
  const form = document.getElementById("wishes-form");
  const successCard = document.getElementById("wishes-success-card");
  const alreadyCard = document.getElementById("wishes-already-sent-card");

  if (form) form.classList.add("hidden");
  if (alreadyCard) alreadyCard.classList.add("hidden");
  if (successCard) successCard.classList.remove("hidden");

  triggerGoldenConfetti();
  showToast("¡Tus deseos fueron enviados con amor! 💌");

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnContent || `<span>ENVIAR DESEO ✨</span>`;
  }
}

function showWishFormAgain() {
  const form = document.getElementById("wishes-form");
  const alreadyCard = document.getElementById("wishes-already-sent-card");
  const successCard = document.getElementById("wishes-success-card");
  const textInput = document.getElementById("wishes-input");

  if (alreadyCard) alreadyCard.classList.add("hidden");
  if (successCard) successCard.classList.add("hidden");
  if (form) form.classList.remove("hidden");
  if (textInput) {
    textInput.value = "";
    textInput.focus();
  }
}

function resetWishForm() {
  showWishFormAgain();
}

// -------------------------------------------------------------
// 6. Confeti Dorado & Celebración
// -------------------------------------------------------------
function triggerGoldenConfetti() {
  if (typeof confetti !== "function") return;

  const count = 120;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio, opts) {
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
      colors: ['#dfba73', '#c5a059', '#faf7f2', '#8a9d86', '#ffffff']
    }));
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

// -------------------------------------------------------------
// 7. Pétalos Flotantes
// -------------------------------------------------------------
function startPetals() {
  const container = document.getElementById("petals-container");
  if (!container) return;

  const totalPetals = 14;
  for (let i = 0; i < totalPetals; i++) {
    createPetal(container);
  }
}

function createPetal(container) {
  const petal = document.createElement("div");
  petal.className = "petal";
  
  const size = Math.random() * 12 + 10;
  petal.style.width = `${size}px`;
  petal.style.height = `${size * 1.3}px`;
  petal.style.left = `${Math.random() * 100}vw`;
  petal.style.animationDuration = `${Math.random() * 6 + 6}s`;
  petal.style.animationDelay = `${Math.random() * 5}s`;
  
  container.appendChild(petal);
}

// -------------------------------------------------------------
// 8. Generar y Descargar Archivo iCal (.ics)
// -------------------------------------------------------------
function downloadICS() {
  const icsData = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Glenis and Elvis//Wedding Invitation//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "SUMMARY:Boda de Glenis y Elvis 💍",
    "DESCRIPTION:Celebración del matrimonio de Glenis y Elvis. Ceremonia en el Convento de La Merced (11:30 am) y Recepción en Villa Novios Saylla (2:00 pm).",
    "LOCATION:Convento de La Merced, Calle Mantas 121, Cusco",
    "DTSTART:20261114T163000Z",
    "DTEND:20261115T050000Z",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", "Boda_Glenis_y_Elvis.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("¡Evento guardado para tu calendario!");
}

// -------------------------------------------------------------
// 9. Procesamiento de Transparencia para el Corazón (Eliminar fondo blanco)
// -------------------------------------------------------------
function makeHeartImageTransparent() {
  const heartImgs = document.querySelectorAll('.date-heart-img');
  heartImgs.forEach((heartImg) => {
    if (!heartImg) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function() {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        // Convertir píxeles blancos o casi blancos a transparente
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (r > 225 && g > 225 && b > 225) {
            data[i + 3] = 0;
          } else if (r > 200 && g > 200 && b > 200) {
            const brightness = (r + g + b) / 3;
            const factor = (225 - brightness) / 25;
            data[i + 3] = Math.round(data[i + 3] * Math.max(0, Math.min(1, factor)));
          }
        }
        ctx.putImageData(imgData, 0, 0);
        heartImg.src = canvas.toDataURL('image/png');
      } catch (e) {
        // En caso de restricción por protocolo local file://, el filtro SVG #remove-white opera en tiempo real
      }
    };
    img.src = heartImg.src;
  });
}

// -------------------------------------------------------------
// 10. Detección de Nombre de Invitado y Pases Personalizados desde URL (?para=...&pases=...)
// -------------------------------------------------------------
function initGuestName() {
  try {
    const params = new URLSearchParams(window.location.search);
    const guestParam = params.get("para") || params.get("invitado") || params.get("guest") || params.get("de");
    const passesParam = params.get("pases") || params.get("pase") || params.get("boletos") || params.get("cupos");

    // Parámetro de prueba para reiniciar la memoria local (?reset=1 o ?limpiar=1)
    if (params.get("reset") === "1" || params.get("limpiar") === "1") {
      const cleanName = (guestParam || "").trim();
      const key = getNormalizedGuestKey(cleanName);
      localStorage.removeItem("wedding_rsvp_" + key);
      localStorage.removeItem("wedding_wish_" + key);
      if (!cleanName || params.get("reset") === "all") {
        Object.keys(localStorage).forEach(k => {
          if (k.startsWith("wedding_rsvp_") || k.startsWith("wedding_wish_")) {
            localStorage.removeItem(k);
          }
        });
      }
      setTimeout(() => showToast("✨ Memoria de prueba reiniciada"), 500);
    }

    if (guestParam) {
      const cleanGuest = guestParam.trim();
      // 1. Mostrar nombre en el sobre de bienvenida después de "para:"
      const guestDisplay = document.getElementById("guest-name-display");
      if (guestDisplay) {
        guestDisplay.textContent = cleanGuest;
        // Calibración tipográfica adaptativa para nombres largos (evita desbordes y asegura legibilidad nupcial)
        const len = cleanGuest.length;
        if (len > 28) {
          guestDisplay.style.fontSize = "clamp(0.95rem, 3.4vw, 1.12rem)";
        } else if (len > 18) {
          guestDisplay.style.fontSize = "clamp(1.05rem, 4.2vw, 1.25rem)";
        } else {
          guestDisplay.style.fontSize = "";
        }
      }
      // 2. Pre-llenar nombre en el modal RSVP de confirmación
      const guestInput = document.getElementById("guest-name");
      if (guestInput) {
        guestInput.value = cleanGuest;
      }
      // 3. Pre-llenar autor en el buzón de deseos
      const wishesAuthor = document.getElementById("wishes-author");
      if (wishesAuthor) {
        wishesAuthor.value = cleanGuest;
      }
      const wishesAuthorDisplay = document.getElementById("wishes-author-display");
      if (wishesAuthorDisplay) {
        wishesAuthorDisplay.textContent = cleanGuest;
      }
      // 4. Actualizar nombre en nota singular si aplica
      const singleGuestName = document.getElementById("single-guest-name");
      if (singleGuestName) {
        singleGuestName.textContent = cleanGuest;
      }
    } else {
      const wishesAuthorDisplay = document.getElementById("wishes-author-display");
      if (wishesAuthorDisplay) {
        wishesAuthorDisplay.textContent = "Familia y Amigos";
      }
    }

    // Sincronización en tiempo real si el usuario edita su nombre en el input
    const guestInput = document.getElementById("guest-name");
    if (guestInput) {
      guestInput.addEventListener("input", () => {
        const val = guestInput.value.trim();
        const wishesAuthor = document.getElementById("wishes-author");
        const wishesAuthorDisplay = document.getElementById("wishes-author-display");
        const singleGuestName = document.getElementById("single-guest-name");
        const guestDisplay = document.getElementById("guest-name-display");
        if (wishesAuthor) wishesAuthor.value = val || "Invitado";
        if (wishesAuthorDisplay) wishesAuthorDisplay.textContent = val || "Familia y Amigos";
        if (singleGuestName) singleGuestName.textContent = val || "ti";
        if (guestDisplay) {
          guestDisplay.textContent = val || "Familia y Amigos";
          const len = val.length;
          if (len > 28) {
            guestDisplay.style.fontSize = "clamp(0.95rem, 3.4vw, 1.12rem)";
          } else if (len > 18) {
            guestDisplay.style.fontSize = "clamp(1.05rem, 4.2vw, 1.25rem)";
          } else {
            guestDisplay.style.fontSize = "";
          }
        }
      });
    }

    if (passesParam) {
      const numPasses = parseInt(passesParam, 10);
      const passesContainer = document.getElementById("guest-passes-container");
      const passesBadge = document.getElementById("guest-passes-badge");
      if (passesContainer) {
        passesContainer.classList.remove("hidden");
      }
      if (passesBadge && !isNaN(numPasses) && numPasses > 0) {
        passesBadge.textContent = numPasses === 1 ? "🎟️ 1 Lugar Reservado" : `🎟️ ${numPasses} Lugares Reservados`;
      }
      
      // Actualizar badge en el modal RSVP
      const rsvpBadge = document.getElementById("rsvp-passes-badge");
      if (rsvpBadge && !isNaN(numPasses) && numPasses > 0) {
        rsvpBadge.textContent = numPasses === 1 ? "1 Pase Reservado" : `${numPasses} Pases Reservados`;
      }

      // Reconstruir opciones en el selector de pases de RSVP según el parámetro de la URL
      const guestCountSelect = document.getElementById("guest-count");
      if (guestCountSelect && !isNaN(numPasses) && numPasses > 0) {
        guestCountSelect.innerHTML = "";
        if (numPasses === 1) {
          const opt = document.createElement("option");
          opt.value = "1";
          opt.textContent = "Confirmo mi pase (1 persona)";
          guestCountSelect.appendChild(opt);
        } else if (numPasses === 2) {
          const opt2 = document.createElement("option");
          opt2.value = "2";
          opt2.textContent = "Confirmamos los 2 (Asistiremos ambos)";
          const opt1 = document.createElement("option");
          opt1.value = "1";
          opt1.textContent = "Solo asistirá 1 de nosotros";
          guestCountSelect.appendChild(opt2);
          guestCountSelect.appendChild(opt1);
        } else {
          for (let i = numPasses; i >= 1; i--) {
            const opt = document.createElement("option");
            opt.value = String(i);
            opt.textContent = i === numPasses 
              ? `Confirmamos los ${i} pases asignados` 
              : (i === 1 ? "Solo asistirá 1 persona" : `Asistiremos ${i} personas`);
            guestCountSelect.appendChild(opt);
          }
        }
        updateAttendeeInputFields();
      }
    } else {
      updateAttendeeInputFields();
    }

    // Verificar si ya envió deseos o RSVP anteriormente
    checkExistingSubmissions();
  } catch (e) {
    console.warn("No se pudo leer el parámetro de invitado:", e);
  }
}

// -------------------------------------------------------------
// -------------------------------------------------------------
// 10. Efectos Fotográficos 3D Personalizados (Prisma, Origami, Medallón)
// -------------------------------------------------------------

// 1. Prisma Nupcial 3D (Portada / Hero)
let heroPrismAngle = 0;
let heroPrismIdx = 0;
let heroPrismInterval = null;

function rotateHeroPrism(direction = 1) {
  const prismRig = document.getElementById("heroPrismRig");
  const dots = document.querySelectorAll(".hero-prism-dot");
  if (!prismRig) return;

  heroPrismAngle -= direction * 120;
  prismRig.style.transform = `rotateY(${heroPrismAngle}deg)`;

  heroPrismIdx = (((-heroPrismAngle / 120) % 3) + 3) % 3;
  dots.forEach((d, i) => {
    if (i === heroPrismIdx) d.classList.add("active");
    else d.classList.remove("active");
  });
}

function setHeroPrismFace(targetIdx) {
  const diff = targetIdx - heroPrismIdx;
  if (diff !== 0) {
    rotateHeroPrism(diff);
  }
}

function initHeroPrism3D() {
  const scene = document.getElementById("heroPrismScene");
  if (!scene) return;

  if (heroPrismInterval) clearInterval(heroPrismInterval);
  heroPrismInterval = setInterval(() => rotateHeroPrism(1), 4800);

  scene.addEventListener("mouseenter", () => clearInterval(heroPrismInterval));
  scene.addEventListener("mouseleave", () => {
    clearInterval(heroPrismInterval);
    heroPrismInterval = setInterval(() => rotateHeroPrism(1), 4800);
  });
}

// 2. Caja Joyera Origami 3D (Padrinos)
let origamiStep = 0;
let origamiInterval = null;

function updateOrigamiDots(activeIdx) {
  const dots = document.querySelectorAll(".origami-dot");
  dots.forEach((d, i) => {
    if (i === activeIdx) d.classList.add("active");
    else d.classList.remove("active");
  });
}

function setOrigamiCard(targetIdx) {
  if (targetIdx === origamiStep) return;
  const cards = [
    document.getElementById("origamiCard0"),
    document.getElementById("origamiCard1"),
    document.getElementById("origamiCard2")
  ];
  if (!cards[0] || !cards[1] || !cards[2]) return;

  const current = cards[origamiStep];
  origamiStep = targetIdx;
  const next = cards[origamiStep];

  // Tapa se abre hacia arriba en 3D
  current.style.transform = "rotateX(85deg) translateY(-40px)";
  current.style.opacity = "0";

  // Siguiente emerge hacia el frente
  next.style.transform = "scale(1) translateZ(0)";
  next.style.opacity = "1";
  next.style.zIndex = "3";

  setTimeout(() => {
    cards.forEach((c, idx) => {
      if (idx !== origamiStep) {
        c.style.transform = "scale(0.88) translateZ(-60px)";
        c.style.opacity = "0";
        c.style.zIndex = "1";
      }
    });
  }, 900);

  updateOrigamiDots(origamiStep);
}

function nextOrigamiCard() {
  const nextIdx = (origamiStep + 1) % 3;
  setOrigamiCard(nextIdx);
}

function initPadrinosOrigami3D() {
  const scene = document.getElementById("padrinosOrigamiScene");
  if (!scene) return;

  if (origamiInterval) clearInterval(origamiInterval);
  origamiInterval = setInterval(nextOrigamiCard, 4800);

  scene.addEventListener("mouseenter", () => clearInterval(origamiInterval));
  scene.addEventListener("mouseleave", () => {
    clearInterval(origamiInterval);
    origamiInterval = setInterval(nextOrigamiCard, 4800);
  });
}

// 3. Medallón Flotante con Inercia de Péndulo (Dress Code)
const medallionImages = [
  "img/foto7.jpeg",
  "img/foto8.jpeg",
  "img/foto9.jpeg"
];
const medallionPositions = [
  "center center",
  "center center",
  "center center"
];
let medallionRot = 0;
let medallionStep = 0;
let medallionInterval = null;

function handleMedallionImgError(imgEl) {
  if (!imgEl) return;
  const src = imgEl.getAttribute("src") || imgEl.src;
  if (src.includes(".jpeg")) {
    imgEl.src = src.replace(".jpeg", ".jpg");
  } else if (src.includes(".jpg")) {
    imgEl.src = src.replace(".jpg", ".png");
  }
}

function updateMedallionDots(activeIdx) {
  const dots = document.querySelectorAll(".medallion-dot");
  dots.forEach((d, i) => {
    if (i === activeIdx) d.classList.add("active");
    else d.classList.remove("active");
  });
}

function setMedallionStep(targetIdx) {
  if (targetIdx === medallionStep) return;
  const rig = document.getElementById("dressMedallionRig");
  const frontImg = document.getElementById("medallionFrontImg");
  const backImg = document.getElementById("medallionBackImg");
  if (!rig || !frontImg || !backImg) return;

  medallionRot += 180;
  medallionStep = targetIdx;
  const isOdd = (medallionRot / 180) % 2 === 1;

  if (isOdd) {
    backImg.src = medallionImages[targetIdx];
    backImg.style.objectPosition = medallionPositions[targetIdx] || "center center";
  } else {
    frontImg.src = medallionImages[targetIdx];
    frontImg.style.objectPosition = medallionPositions[targetIdx] || "center center";
  }

  rig.style.transform = `rotateY(${medallionRot}deg)`;
  updateMedallionDots(medallionStep);

  setTimeout(() => {
    const nextIdx = (medallionStep + 1) % medallionImages.length;
    if (isOdd) {
      frontImg.src = medallionImages[nextIdx];
      frontImg.style.objectPosition = medallionPositions[nextIdx] || "center center";
    } else {
      backImg.src = medallionImages[nextIdx];
      backImg.style.objectPosition = medallionPositions[nextIdx] || "center center";
    }
  }, 620);
}

function flipMedallion() {
  const nextIdx = (medallionStep + 1) % medallionImages.length;
  setMedallionStep(nextIdx);
}

function initDressCodeMedallion3D() {
  const scene = document.getElementById("dressMedallionScene");
  if (!scene) return;

  if (medallionInterval) clearInterval(medallionInterval);
  medallionInterval = setInterval(flipMedallion, 4800);

  scene.addEventListener("mouseenter", () => clearInterval(medallionInterval));
  scene.addEventListener("mouseleave", () => {
    clearInterval(medallionInterval);
    medallionInterval = setInterval(flipMedallion, 4800);
  });
}

// -------------------------------------------------------------
// Inicialización al cargar la página y puente en tiempo real
// -------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initEnvelopeState();
  initCountdown();
  makeHeartImageTransparent();
  initGuestName();

  // Inicializar los 3 efectos fotográficos 3D
  initHeroPrism3D();
  initPadrinosOrigami3D();
  initDressCodeMedallion3D();

  // Notificar al panel editor si estamos dentro de un iframe
  try {
    if (window.parent && window.parent !== window) {
      sendAllElementsToParent();
      attachIframeClickListeners();
    }
  } catch (e) {}
});

// Helper: convertir RGB a Hex
function colorRgbToHex(rgb) {
  if (!rgb || rgb === "transparent") return "#543550";
  if (rgb.startsWith("#")) return rgb;
  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) return "#543550";
  const r = parseInt(match[0], 10).toString(16).padStart(2, '0');
  const g = parseInt(match[1], 10).toString(16).padStart(2, '0');
  const b = parseInt(match[2], 10).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

// Extraer propiedades calculadas e inline de un elemento
function extractEditableData(el) {
  if (!el) return null;

  // Caso especial: Corazón de la fecha (SVG interactivo)
  if (el.getAttribute("data-edit") === "date_heart_badge" || el.classList.contains("date-heart-badge")) {
    const heartPath = el.querySelector("#dateHeartPath") || el.querySelector("path[fill]:not([fill='#faf7f2'])");
    const currentColor = heartPath ? (heartPath.style.fill || heartPath.getAttribute("fill") || "#6e4c69") : "#6e4c69";
    let widthPx = 86;
    if (el.style.width) {
      widthPx = parseInt(el.style.width, 10);
    } else {
      const comp = window.getComputedStyle(el);
      widthPx = Math.round(parseFloat(comp.width)) || 86;
    }
    return {
      text: "Corazón Decorativo (Vector SVG)",
      size: widthPx,
      bold: false,
      italic: false,
      color: colorRgbToHex(currentColor),
      font: "font-cormorant",
      align: "center",
      lineHeight: "1.35"
    };
  }

  // Caso especial: Números del contador regresivo (Días, Horas, Minutos, Segundos)
  if (el.getAttribute("data-edit") === "countdown_digits" || el.classList.contains("countdown-digit-val")) {
    const daysEl = document.getElementById("countdown-days") || el;
    const computedDays = window.getComputedStyle(daysEl);
    let pxSize = 36;
    if (daysEl.style.fontSize) {
      pxSize = parseInt(daysEl.style.fontSize, 10);
    } else if (computedDays && computedDays.fontSize) {
      pxSize = Math.round(parseFloat(computedDays.fontSize));
    }
    const rawColor = daysEl.style.color || (computedDays ? computedDays.color : "#543550");
    const hexColor = colorRgbToHex(rawColor);
    const fw = daysEl.style.fontWeight || (computedDays ? computedDays.fontWeight : "");
    const isBold = (fw === "bold" || parseInt(fw, 10) >= 600);
    const fs = daysEl.style.fontStyle || (computedDays ? computedDays.fontStyle : "");
    const isItalic = (fs === "italic");
    let fontClass = "font-serif-title";
    if (daysEl.classList.contains("font-aniyah")) fontClass = "font-aniyah";
    else if (daysEl.classList.contains("font-cormorant")) fontClass = "font-cormorant";
    else if (daysEl.classList.contains("font-script")) fontClass = "font-script";
    else if (daysEl.classList.contains("font-sans")) fontClass = "font-sans";
    else if (daysEl.classList.contains("font-cinzel")) fontClass = "font-cinzel";

    return {
      text: "Valores Numéricos (Generados por el reloj)",
      size: pxSize,
      bold: isBold,
      italic: isItalic,
      color: hexColor,
      font: fontClass,
      align: "center",
      lineHeight: "1"
    };
  }

  // Caso especial: Marco y Fondo de las Tarjetas Bancarias
  if (el.getAttribute("data-edit") === "bank_cards_style" || el.classList.contains("bank-card-box")) {
    const bcpCard = document.getElementById("bank-card-bcp") || el;
    const comp = window.getComputedStyle(bcpCard);
    let opacityPct = 95;
    const bg = bcpCard.style.backgroundColor || (comp ? comp.backgroundColor : "");
    if (bg === "transparent" || bg === "rgba(0, 0, 0, 0)") {
      opacityPct = 0;
    } else if (bg.startsWith("rgba")) {
      const parts = bg.match(/[\d.]+/g);
      if (parts && parts.length >= 4) {
        opacityPct = Math.round(parseFloat(parts[3]) * 100);
      }
    } else if (bg === "rgb(255, 255, 255)" || bg === "#ffffff") {
      opacityPct = 100;
    }
    const hasBorder = bcpCard.style.borderColor !== "transparent";

    return {
      text: "Marco de Tarjetas Bancarias (Fondo y Transparencia)",
      size: opacityPct,
      opacity: opacityPct,
      border: hasBorder,
      bold: false,
      italic: false,
      color: "#543550",
      font: "font-serif-title",
      align: "center",
      lineHeight: "1.35"
    };
  }

  // Caso especial: Botones de copia bancaria (BCP y Yape/Plin)
  if (el.getAttribute("data-edit") === "bank_bcp_btn" || el.getAttribute("data-edit") === "bank_yape_btn" || el.classList.contains("bank-copy-btn")) {
    const computedBtn = window.getComputedStyle(el);
    const textSpan = el.querySelector(".btn-text-content");
    const btnText = textSpan ? textSpan.textContent.trim() : (el.textContent ? el.textContent.trim() : "");
    
    // Tamaño de letra (px)
    let pxSize = 12;
    if (el.style.fontSize) {
      pxSize = parseInt(el.style.fontSize, 10);
    } else if (computedBtn && computedBtn.fontSize) {
      pxSize = Math.round(parseFloat(computedBtn.fontSize)) || 12;
    }

    // Grosor / Padding vertical (px)
    let paddingY = 10;
    if (el.style.paddingTop) {
      paddingY = parseInt(el.style.paddingTop, 10);
    } else if (computedBtn && computedBtn.paddingTop) {
      paddingY = Math.round(parseFloat(computedBtn.paddingTop)) || 10;
    }

    // Modo de ancho
    const isCompact = el.classList.contains("w-auto") || (el.style.width && el.style.width === "fit-content");
    const widthMode = isCompact ? "compact" : "full";

    // Color de fondo del botón
    const rawBg = el.style.backgroundColor || (computedBtn ? computedBtn.backgroundColor : "#fceef1");
    const hexBg = colorRgbToHex(rawBg);

    // Color de texto del botón
    const rawColor = el.style.color || (computedBtn ? computedBtn.color : "#6e4c69");
    const hexColor = colorRgbToHex(rawColor);

    // Negrita
    const fw = el.style.fontWeight || (computedBtn ? computedBtn.fontWeight : "");
    const isBold = (fw === "bold" || parseInt(fw, 10) >= 600);

    // Cursiva
    const fs = el.style.fontStyle || (computedBtn ? computedBtn.fontStyle : "");
    const isItalic = (fs === "italic");

    // Fuente
    let fontClass = "font-sans";
    if (el.classList.contains("font-cormorant")) fontClass = "font-cormorant";
    else if (el.classList.contains("font-serif-title")) fontClass = "font-serif-title";
    else if (el.classList.contains("font-aniyah")) fontClass = "font-aniyah";
    else if (el.classList.contains("font-script")) fontClass = "font-script";
    else if (el.classList.contains("font-cinzel")) fontClass = "font-cinzel";

    return {
      text: btnText,
      size: pxSize,
      paddingY: paddingY,
      widthMode: widthMode,
      btnBgColor: hexBg,
      color: hexColor,
      bold: isBold,
      italic: isItalic,
      font: fontClass,
      align: "center",
      lineHeight: "1"
    };
  }

  const computed = window.getComputedStyle(el);
  
  // Tamaño en px
  let pxSize = 18;
  if (el.style.fontSize) {
    pxSize = parseInt(el.style.fontSize, 10);
  } else if (computed && computed.fontSize) {
    pxSize = Math.round(parseFloat(computed.fontSize));
  }

  // Negrita
  const fw = el.style.fontWeight || (computed ? computed.fontWeight : "");
  const isBold = (fw === "bold" || parseInt(fw, 10) >= 600);

  // Cursiva
  const fs = el.style.fontStyle || (computed ? computed.fontStyle : "");
  const isItalic = (fs === "italic");

  // Color hex
  const rawColor = el.style.color || (computed ? computed.color : "#543550");
  const hexColor = colorRgbToHex(rawColor);

  // Clase de fuente tipográfica
  let fontClass = "font-cormorant";
  if (el.classList.contains("font-aniyah")) fontClass = "font-aniyah";
  else if (el.classList.contains("font-serif-title")) fontClass = "font-serif-title";
  else if (el.classList.contains("font-script")) fontClass = "font-script";
  else if (el.classList.contains("font-sans")) fontClass = "font-sans";
  else if (el.classList.contains("font-cinzel")) fontClass = "font-cinzel";

  // Alineación
  const textAlign = el.style.textAlign || (computed ? computed.textAlign : "center");

  // Interlineado
  let lineHeight = el.style.lineHeight || (computed ? computed.lineHeight : "1.35");

  // Texto
  let text = "";
  const clone = el.cloneNode(true);
  clone.querySelectorAll("br").forEach(br => br.replaceWith("\n"));
  text = clone.textContent.trim();

  return {
    text: text,
    size: pxSize,
    bold: isBold,
    italic: isItalic,
    color: hexColor,
    font: fontClass,
    align: textAlign,
    lineHeight: lineHeight
  };
}

function sendAllElementsToParent() {
  if (!window.parent || window.parent === window) return;
  const elements = {};
  document.querySelectorAll("[data-edit]").forEach(el => {
    const key = el.getAttribute("data-edit");
    if (key) {
      elements[key] = extractEditableData(el);
    }
  });
  window.parent.postMessage({
    type: "INVITATION_LOADED",
    elements: elements
  }, "*");
}

function attachIframeClickListeners() {
  document.querySelectorAll("[data-edit]").forEach(el => {
    el.style.cursor = "pointer";
    el.setAttribute("title", "Toca para editar en el panel");
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const key = el.getAttribute("data-edit");
      if (key && window.parent) {
        window.parent.postMessage({
          type: "ELEMENT_CLICKED",
          key: key,
          data: extractEditableData(el)
        }, "*");
      }
    });
  });
}

// -------------------------------------------------------------
// Sincronización en tiempo real con editor.html (bidireccional)
// -------------------------------------------------------------
window.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || !data.type) return;

  if (data.type === "UPDATE_FIELD") {
    const el = document.querySelector(`[data-edit="${data.key}"]`) || (data.selector ? document.querySelector(data.selector) : null);
    if (el) {
      // Caso especial: Corazón de la fecha
      if (data.key === "date_heart_badge" || el.classList.contains("date-heart-badge")) {
        if (data.size !== undefined) {
          const sz = parseInt(data.size, 10);
          if (!isNaN(sz)) {
            el.style.width = `${sz}px`;
            el.style.height = `${Math.round(sz * 0.95)}px`;
          }
        }
        if (data.color !== undefined) {
          const heartPath = el.querySelector("#dateHeartPath") || el.querySelector("path[fill]:not([fill='#faf7f2'])");
          if (heartPath) {
            heartPath.setAttribute("fill", data.color);
            heartPath.style.fill = data.color;
          }
        }
        return;
      }

      // Caso especial: Valores numéricos de la cuenta regresiva (Días, Horas, Minutos, Segundos)
      if (data.key === "countdown_digits" || el.getAttribute("data-edit") === "countdown_digits" || el.classList.contains("countdown-digit-val")) {
        const digits = document.querySelectorAll(".countdown-digit-val, #countdown-days, #countdown-hours, #countdown-minutes, #countdown-seconds");
        const separators = document.querySelectorAll(".countdown-separator");

        if (data.size !== undefined) {
          const sz = parseInt(data.size, 10);
          if (!isNaN(sz)) {
            digits.forEach(d => {
              d.style.fontSize = `${sz}px`;
            });
            const sepSize = Math.max(14, Math.round(sz * 0.7));
            separators.forEach(s => {
              s.style.fontSize = `${sepSize}px`;
            });
          }
        }
        if (data.color !== undefined) {
          digits.forEach(d => {
            d.style.color = data.color;
            d.style.setProperty("color", data.color, "important");
          });
        }
        if (data.bold !== undefined) {
          digits.forEach(d => {
            d.style.fontWeight = data.bold ? "bold" : "normal";
          });
        }
        if (data.italic !== undefined) {
          digits.forEach(d => {
            d.style.fontStyle = data.italic ? "italic" : "normal";
          });
        }
        if (data.font !== undefined) {
          const fontClasses = ["font-cormorant", "font-aniyah", "font-serif-title", "font-script", "font-sans", "font-cinzel"];
          digits.forEach(d => {
            fontClasses.forEach(c => d.classList.remove(c));
            if (data.font) d.classList.add(data.font);
          });
        }
        return;
      }

      // Caso especial: Estilo y transparencia del marco de tarjetas bancarias
      if (data.key === "bank_cards_style" || el.getAttribute("data-edit") === "bank_cards_style" || el.classList.contains("bank-card-box")) {
        const cards = document.querySelectorAll(".bank-card-box");
        const val = (data.opacity !== undefined) ? parseInt(data.opacity, 10) : (data.size !== undefined ? parseInt(data.size, 10) : NaN);
        if (!isNaN(val)) {
          const alpha = Math.max(0, Math.min(100, val)) / 100;
          cards.forEach(c => {
            if (alpha === 0) {
              c.style.backgroundColor = "transparent";
              c.style.boxShadow = "none";
              c.style.backdropFilter = "none";
              c.style.webkitBackdropFilter = "none";
            } else {
              c.style.backgroundColor = `rgba(255, 255, 255, ${alpha})`;
              c.style.boxShadow = alpha >= 0.2 ? "0 4px 15px rgba(0, 0, 0, 0.05)" : "none";
              c.style.backdropFilter = alpha < 1 ? "blur(4px)" : "none";
              c.style.webkitBackdropFilter = alpha < 1 ? "blur(4px)" : "none";
            }
          });
        }
        if (data.border !== undefined) {
          cards.forEach(c => {
            if (data.border === false || data.border === "none") {
              c.style.borderColor = "transparent";
            } else {
              c.style.borderColor = "";
            }
          });
        }
        return;
      }

      // Caso especial: Botones de copia bancaria (BCP y Yape/Plin)
      if (data.key === "bank_bcp_btn" || data.key === "bank_yape_btn" || el.classList.contains("bank-copy-btn")) {
        if (data.text !== undefined) {
          const textSpan = el.querySelector(".btn-text-content");
          if (textSpan) {
            textSpan.textContent = data.text;
          } else {
            const svg = el.querySelector("svg");
            el.innerHTML = "";
            if (svg) el.appendChild(svg);
            const newSpan = document.createElement("span");
            newSpan.className = "btn-text-content";
            newSpan.textContent = data.text;
            el.appendChild(newSpan);
          }
        }
        if (data.size !== undefined) {
          el.style.fontSize = `${data.size}px`;
        }
        if (data.paddingY !== undefined) {
          const py = parseInt(data.paddingY, 10);
          if (!isNaN(py)) {
            el.style.paddingTop = `${py}px`;
            el.style.paddingBottom = `${py}px`;
          }
        }
        if (data.widthMode !== undefined) {
          if (data.widthMode === "compact") {
            el.classList.remove("w-full");
            el.classList.add("w-auto", "mx-auto", "px-6");
            el.style.width = "fit-content";
            el.style.margin = "0 auto";
          } else {
            el.classList.add("w-full");
            el.classList.remove("w-auto", "mx-auto", "px-6");
            el.style.width = "100%";
            el.style.margin = "";
          }
        }
        if (data.btnBgColor !== undefined) {
          el.style.backgroundColor = data.btnBgColor;
        }
        if (data.color !== undefined) {
          el.style.color = data.color;
          el.style.setProperty("color", data.color, "important");
        }
        if (data.bold !== undefined) {
          el.style.fontWeight = data.bold ? "bold" : "normal";
        }
        if (data.italic !== undefined) {
          el.style.fontStyle = data.italic ? "italic" : "normal";
        }
        if (data.font !== undefined) {
          const fontClasses = ["font-cormorant", "font-aniyah", "font-serif-title", "font-script", "font-sans", "font-cinzel"];
          fontClasses.forEach(c => el.classList.remove(c));
          if (data.font) el.classList.add(data.font);
        }
        return;
      }

      if (data.text !== undefined) {
        if (data.text.includes("\n")) {
          el.innerHTML = data.text.split("\n").map(l => l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")).join("<br>");
        } else {
          el.textContent = data.text;
        }
      }
      if (data.color !== undefined) {
        el.style.color = data.color;
        el.style.setProperty("color", data.color, "important");
      }
      if (data.size !== undefined) {
        el.style.fontSize = `${data.size}${data.sizeUnit || "px"}`;
      }
      if (data.bold !== undefined) {
        el.style.fontWeight = data.bold ? "bold" : "normal";
      }
      if (data.italic !== undefined) {
        el.style.fontStyle = data.italic ? "italic" : "normal";
      }
      if (data.font !== undefined) {
        const fontClasses = ["font-cormorant", "font-aniyah", "font-serif-title", "font-script", "font-sans", "font-cinzel"];
        fontClasses.forEach(c => el.classList.remove(c));
        if (data.font) el.classList.add(data.font);
      }
      if (data.align !== undefined) {
        el.style.textAlign = data.align;
      }
      if (data.lineHeight !== undefined) {
        el.style.lineHeight = data.lineHeight;
      }
    }
  } else if (data.type === "SELECT_ELEMENT") {
    if (data.key === "bank_cards_style") {
      const modal = document.getElementById("welcome-modal");
      const rsvpModal = document.getElementById("rsvp-modal");
      if (modal && !modal.classList.contains("hidden-modal") && modal.style.display !== "none") {
        modal.style.display = "none";
      }
      if (rsvpModal) rsvpModal.classList.add("hidden");

      const cards = document.querySelectorAll(".bank-card-box");
      const bcpCard = document.getElementById("bank-card-bcp");
      if (bcpCard) {
        bcpCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      cards.forEach(c => {
        const prevOutline = c.style.outline;
        const prevOffset = c.style.outlineOffset;
        c.style.outline = "2px solid #dfba73";
        c.style.outlineOffset = "4px";
        setTimeout(() => {
          c.style.outline = prevOutline;
          c.style.outlineOffset = prevOffset;
        }, 1400);
      });

      if (window.parent) {
        window.parent.postMessage({
          type: "ELEMENT_DATA_RESPONSE",
          key: data.key,
          data: extractEditableData(bcpCard || cards[0])
        }, "*");
      }
      return;
    }

    if (data.key === "countdown_digits") {
      const modal = document.getElementById("welcome-modal");
      const rsvpModal = document.getElementById("rsvp-modal");
      const bankModal = document.getElementById("bank-modal");
      if (modal && !modal.classList.contains("hidden-modal") && modal.style.display !== "none") {
        modal.style.display = "none";
      }
      if (rsvpModal) rsvpModal.classList.add("hidden");
      if (bankModal) bankModal.classList.add("hidden");

      const digits = document.querySelectorAll(".countdown-digit-val, #countdown-days, #countdown-hours, #countdown-minutes, #countdown-seconds");
      const daysEl = document.getElementById("countdown-days");
      if (daysEl) {
        daysEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      digits.forEach(d => {
        const prevOutline = d.style.outline;
        const prevOffset = d.style.outlineOffset;
        d.style.outline = "2px solid #dfba73";
        d.style.outlineOffset = "4px";
        setTimeout(() => {
          d.style.outline = prevOutline;
          d.style.outlineOffset = prevOffset;
        }, 1400);
      });

      if (window.parent) {
        window.parent.postMessage({
          type: "ELEMENT_DATA_RESPONSE",
          key: data.key,
          data: extractEditableData(daysEl || digits[0])
        }, "*");
      }
      return;
    }

    const el = document.querySelector(`[data-edit="${data.key}"]`);
    if (el) {
      const modal = document.getElementById("welcome-modal");
      const rsvpModal = document.getElementById("rsvp-modal");

      if (data.key.startsWith("modal_")) {
        if (modal) {
          modal.classList.remove("hidden-modal");
          modal.style.display = "flex";
        }
        if (rsvpModal) rsvpModal.classList.add("hidden");
      } else if (data.key.startsWith("rsvp_modal_") || data.key.startsWith("rsvp_opt_") || data.key === "rsvp_question") {
        if (modal) modal.style.display = "none";
        if (rsvpModal) rsvpModal.classList.add("hidden");
      } else {
        if (modal && !modal.classList.contains("hidden-modal") && modal.style.display !== "none") {
          modal.style.display = "none";
        }
        if (rsvpModal) rsvpModal.classList.add("hidden");
      }

      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const prevOutline = el.style.outline;
        const prevOffset = el.style.outlineOffset;
        el.style.outline = "2px solid #dfba73";
        el.style.outlineOffset = "4px";
        setTimeout(() => {
          el.style.outline = prevOutline;
          el.style.outlineOffset = prevOffset;
        }, 1400);
      }, 60);

      if (window.parent) {
        window.parent.postMessage({
          type: "ELEMENT_DATA_RESPONSE",
          key: data.key,
          data: extractEditableData(el)
        }, "*");
      }
    }
  } else if (data.type === "TOGGLE_ENVELOPE_VIEW") {
    const modal = document.getElementById("welcome-modal");
    if (modal) {
      const isVisible = !modal.classList.contains("hidden-modal") && modal.style.display !== "none";
      if (isVisible) {
        modal.style.display = "none";
      } else {
        modal.classList.remove("hidden-modal");
        modal.style.display = "flex";
      }
    }
  } else if (data.type === "TOGGLE_ENVELOPE") {
    const modal = document.getElementById("welcome-modal");
    if (modal) {
      modal.style.display = data.open ? "none" : "flex";
    }
  } else if (data.type === "REQUEST_ALL_ELEMENTS") {
    sendAllElementsToParent();
  } else if (data.type === "SYNC_ALL") {
    const fields = data.fields;
    if (!fields) return;
    for (const key in fields) {
      const item = fields[key];

      if (key === "bank_cards_style") {
        const cards = document.querySelectorAll(".bank-card-box");
        const val = (item.opacity !== undefined) ? parseInt(item.opacity, 10) : (item.size !== undefined ? parseInt(item.size, 10) : NaN);
        if (!isNaN(val)) {
          const alpha = Math.max(0, Math.min(100, val)) / 100;
          cards.forEach(c => {
            if (alpha === 0) {
              c.style.backgroundColor = "transparent";
              c.style.boxShadow = "none";
            } else {
              c.style.backgroundColor = `rgba(255, 255, 255, ${alpha})`;
            }
          });
        }
        if (item.border !== undefined) {
          cards.forEach(c => {
            if (item.border === false) c.style.borderColor = "transparent";
            else c.style.borderColor = "";
          });
        }
        continue;
      }

      if (key === "countdown_digits") {
        const digits = document.querySelectorAll(".countdown-digit-val, #countdown-days, #countdown-hours, #countdown-minutes, #countdown-seconds");
        const separators = document.querySelectorAll(".countdown-separator");
        if (item.size !== undefined) {
          const sz = parseInt(item.size, 10);
          if (!isNaN(sz)) {
            digits.forEach(d => d.style.fontSize = `${sz}px`);
            const sepSize = Math.max(14, Math.round(sz * 0.7));
            separators.forEach(s => s.style.fontSize = `${sepSize}px`);
          }
        }
        if (item.color !== undefined) {
          digits.forEach(d => {
            d.style.color = item.color;
            d.style.setProperty("color", item.color, "important");
          });
        }
        if (item.bold !== undefined) digits.forEach(d => d.style.fontWeight = item.bold ? "bold" : "normal");
        if (item.italic !== undefined) digits.forEach(d => d.style.fontStyle = item.italic ? "italic" : "normal");
        if (item.font !== undefined) {
          const fontClasses = ["font-cormorant", "font-aniyah", "font-serif-title", "font-script", "font-sans", "font-cinzel"];
          digits.forEach(d => {
            fontClasses.forEach(c => d.classList.remove(c));
            if (item.font) d.classList.add(item.font);
          });
        }
        continue;
      }

      if (key === "date_heart_badge") {
        const heartBadge = document.querySelector('[data-edit="date_heart_badge"]');
        if (heartBadge) {
          if (item.size !== undefined) {
            const sz = parseInt(item.size, 10);
            if (!isNaN(sz)) {
              heartBadge.style.width = `${sz}px`;
              heartBadge.style.height = `${Math.round(sz * 0.95)}px`;
            }
          }
          if (item.color !== undefined) {
            const heartPath = heartBadge.querySelector("#dateHeartPath") || heartBadge.querySelector("path[fill]:not([fill='#faf7f2'])");
            if (heartPath) {
              heartPath.setAttribute("fill", item.color);
              heartPath.style.fill = item.color;
            }
          }
        }
        continue;
      }

      if (key === "bank_bcp_btn" || key === "bank_yape_btn") {
        const btnEl = document.querySelector(`[data-edit="${key}"]`);
        if (btnEl) {
          if (item.text !== undefined) {
            const textSpan = btnEl.querySelector(".btn-text-content");
            if (textSpan) textSpan.textContent = item.text;
          }
          if (item.size !== undefined) btnEl.style.fontSize = `${item.size}px`;
          if (item.paddingY !== undefined) {
            const py = parseInt(item.paddingY, 10);
            if (!isNaN(py)) {
              btnEl.style.paddingTop = `${py}px`;
              btnEl.style.paddingBottom = `${py}px`;
            }
          }
          if (item.widthMode !== undefined) {
            if (item.widthMode === "compact") {
              btnEl.classList.remove("w-full");
              btnEl.classList.add("w-auto", "mx-auto", "px-6");
              btnEl.style.width = "fit-content";
              btnEl.style.margin = "0 auto";
            } else {
              btnEl.classList.add("w-full");
              btnEl.classList.remove("w-auto", "mx-auto", "px-6");
              btnEl.style.width = "100%";
              btnEl.style.margin = "";
            }
          }
          if (item.btnBgColor !== undefined) btnEl.style.backgroundColor = item.btnBgColor;
          if (item.color !== undefined) {
            btnEl.style.color = item.color;
            btnEl.style.setProperty("color", item.color, "important");
          }
          if (item.bold !== undefined) btnEl.style.fontWeight = item.bold ? "bold" : "normal";
          if (item.italic !== undefined) btnEl.style.fontStyle = item.italic ? "italic" : "normal";
          if (item.font !== undefined) {
            const fontClasses = ["font-cormorant", "font-aniyah", "font-serif-title", "font-script", "font-sans", "font-cinzel"];
            fontClasses.forEach(c => btnEl.classList.remove(c));
            if (item.font) btnEl.classList.add(item.font);
          }
        }
        continue;
      }

      const target = document.querySelector(`[data-edit="${key}"]`);
      if (target) {
        if (item.text !== undefined) {
          if (item.text.includes("\n")) {
            target.innerHTML = item.text.split("\n").map(l => l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")).join("<br>");
          } else {
            target.textContent = item.text;
          }
        }
        if (item.color !== undefined) target.style.color = item.color;
        if (item.size !== undefined) target.style.fontSize = `${item.size}${item.sizeUnit || "px"}`;
        if (item.bold !== undefined) target.style.fontWeight = item.bold ? "bold" : "normal";
        if (item.italic !== undefined) target.style.fontStyle = item.italic ? "italic" : "normal";
        if (item.font !== undefined) {
          const fontClasses = ["font-cormorant", "font-aniyah", "font-serif-title", "font-script", "font-sans", "font-cinzel"];
          fontClasses.forEach(c => target.classList.remove(c));
          if (item.font) target.classList.add(item.font);
        }
        if (item.align !== undefined) target.style.textAlign = item.align;
        if (item.lineHeight !== undefined) target.style.lineHeight = item.lineHeight;
      }
    }
  } else if (data.type === "UPDATE_GLOBAL_STYLE") {
    if (data.varName && data.value !== undefined) {
      document.documentElement.style.setProperty(data.varName, data.value);
      if (data.varName === '--envelope-bg') {
        document.documentElement.style.setProperty('--envelope-flap-bg', `linear-gradient(180deg, color-mix(in srgb, ${data.value} 80%, white 20%) 0%, ${data.value} 100%)`);
        document.documentElement.style.setProperty('--envelope-pocket-bg', `linear-gradient(135deg, color-mix(in srgb, ${data.value} 90%, white 10%) 0%, ${data.value} 100%)`);
      }
    }
  } else if (data.type === "SYNC_GLOBAL_STYLES") {
    if (data.styles) {
      for (const varName in data.styles) {
        document.documentElement.style.setProperty(varName, data.styles[varName]);
        if (varName === '--envelope-bg') {
          const val = data.styles[varName];
          document.documentElement.style.setProperty('--envelope-flap-bg', `linear-gradient(180deg, color-mix(in srgb, ${val} 80%, white 20%) 0%, ${val} 100%)`);
          document.documentElement.style.setProperty('--envelope-pocket-bg', `linear-gradient(135deg, color-mix(in srgb, ${val} 90%, white 10%) 0%, ${val} 100%)`);
        }
      }
    }
  } else if (data.type === "REQUEST_HTML_EXPORT") {
    // 0. Persistir variables globales en un tag <style> permanente antes de exportar
    const rootStyles = document.documentElement.style;
    if (rootStyles) {
      const watchedProps = [
        '--font-family-title', '--font-family-body',
        '--btn-palette-bg', '--btn-palette-text', '--btn-gold-bg', '--btn-gold-text',
        '--envelope-bg', '--envelope-flap-bg', '--envelope-pocket-bg', '--seal-color',
        '--card-spacing-y', '--card-padding-y', '--card-bg-opacity'
      ];
      let customRules = [];
      watchedProps.forEach(prop => {
        const val = rootStyles.getPropertyValue(prop);
        if (val) customRules.push(`  ${prop}: ${val};`);
      });
      if (customRules.length > 0) {
        let styleTag = document.getElementById('custom-invitation-variables');
        if (!styleTag) {
          styleTag = document.createElement('style');
          styleTag.id = 'custom-invitation-variables';
          document.head.appendChild(styleTag);
        }
        styleTag.textContent = `:root {\n${customRules.join('\n')}\n}`;
      }
    }
    // 1. Elementos del sobre de bienvenida
    const modal = document.getElementById("welcome-modal");
    const envelopeElement = document.getElementById("envelopeElement");
    const introHeader = document.getElementById("introHeader");
    const instructionText = document.getElementById("instructionText");
    
    // Guardar estados previos para que el usuario no note alteraciones en su vista previa
    const wasHidden = modal && (modal.classList.contains("hidden-modal") || modal.style.display === "none");
    const hadEnvelopeOpen = envelopeElement ? envelopeElement.classList.contains("envelope-open") : false;
    const hadHeaderDisappear = introHeader ? introHeader.classList.contains("header-full-disappear") : false;
    
    // 2. RESTAURAR EL SOBRE 100% CERRADO Y CON SELLO INTACTO PARA LOS INVITADOS
    if (modal) {
      modal.classList.remove("hidden-modal");
      modal.style.display = "";
    }
    if (envelopeElement) {
      envelopeElement.classList.remove("envelope-open");
      envelopeElement.classList.remove("envelope-state-open");
      envelopeElement.classList.remove("card-is-active");
    }
    const envScreen = document.getElementById("envelopeScreen");
    const stgWrapper = document.getElementById("stageWrapper");
    if (envScreen) envScreen.classList.remove("card-is-active");
    if (stgWrapper) stgWrapper.classList.remove("card-is-active");
    if (instructionText) {
      instructionText.classList.add("hidden");
      instructionText.innerText = "";
    }
    const sealBtn = document.getElementById("sealButtonContainer");
    if (sealBtn) {
      sealBtn.classList.remove("seal-opened");
    }
    const envVideo = document.getElementById("envelopeVideo");
    if (envVideo) {
      try {
        envVideo.pause();
        envVideo.currentTime = 0;
      } catch(e) {}
    }
    if (introHeader) {
      introHeader.classList.remove("header-full-disappear");
    }
    // Limpiar contornos temporales del editor
    document.querySelectorAll("[data-edit]").forEach(el => {
      el.style.outline = "";
      el.style.outlineOffset = "";
    });

    // 3. Capturar el HTML completo y limpio
    const fullHtml = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
    
    // 4. Devolver la vista previa del editor a su estado actual
    if (wasHidden && modal) {
      modal.style.display = "none";
    }
    if (hadEnvelopeOpen && envelopeElement) {
      envelopeElement.classList.add("envelope-open");
    }
    if (hadHeaderDisappear && introHeader) {
      introHeader.classList.add("header-full-disappear");
    }
    
    if (window.parent) {
      window.parent.postMessage({
        type: "EXPORT_HTML_RESPONSE",
        html: fullHtml
      }, "*");
    }
  }
});
