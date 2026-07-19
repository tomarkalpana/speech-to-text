// ===== Speech-to-Text Web Application =====
// Uses the browser's Web Speech API (SpeechRecognition)

// ----- Grab elements -----
const statusEl = document.getElementById('status');
const transcriptEl = document.getElementById('transcriptText');
const errorEl = document.getElementById('errorMsg');

// NOTE: In the existing HTML the labels and ids don't match 1-to-1:
//   id="copyBtn"  -> button TEXT is "Clear Text"  -> should CLEAR
//   id="clearBtn" -> button TEXT is "Copy Text"   -> should COPY
// We wire functionality to match what the button actually SAYS on screen,
// without changing any HTML/CSS.
const startBtn = document.getElementById('startBtn');
const clearActionBtn = document.getElementById('copyBtn');   // labeled "Clear Text"
const copyActionBtn = document.getElementById('clearBtn');   // labeled "Copy Text"

// ----- State -----
let recognition = null;
let isListening = false;
let finalTranscript = '';

// ----- Helper: show/clear error messages -----
function showError(message) {
  errorEl.textContent = message;
  errorEl.style.display = 'block';
}

function clearError() {
  errorEl.textContent = '';
  errorEl.style.display = 'none';
}

function setStatus(text) {
  statusEl.textContent = text;
}

// ----- Check browser support -----
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  setStatus('');
  showError('Speech Recognition is not supported in this browser. Please try Google Chrome or Microsoft Edge.');
  startBtn.disabled = true;
  startBtn.style.opacity = '0.5';
  startBtn.style.cursor = 'not-allowed';
} else {
  // ----- Set up recognition -----
  recognition = new SpeechRecognition();
  recognition.continuous = true;       // keep listening until stopped
  recognition.interimResults = true;   // show live results while speaking
  recognition.lang = 'en-US';

  setStatus('Idle');

  // Fired whenever new speech results come in
  recognition.onresult = function (event) {
    let interimTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcriptPiece = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += transcriptPiece + ' ';
      } else {
        interimTranscript += transcriptPiece;
      }
    }

    // Show final text (confirmed) + interim text (still being spoken)
    transcriptEl.value = finalTranscript + interimTranscript;

    // Auto-scroll to the bottom as text grows
    transcriptEl.scrollTop = transcriptEl.scrollHeight;
  };

  // Fired when recognition starts
  recognition.onstart = function () {
    isListening = true;
    setStatus('Listening...');
    clearError();
    startBtn.textContent = 'Stop Recording';
    startBtn.style.background = 'darkred';
  };

  // Fired when recognition ends (manually stopped or times out)
  recognition.onend = function () {
    isListening = false;
    setStatus('');
    startBtn.textContent = 'Start Recording';
    startBtn.style.background = 'red';
  };

  // Fired on errors (e.g. mic permission denied, no speech, network issue)
  recognition.onerror = function (event) {
    isListening = false;
    setStatus('');
    startBtn.textContent = 'Start Recording';
    startBtn.style.background = 'red';

    switch (event.error) {
      case 'not-allowed':
      case 'permission-denied':
        showError('Microphone access was denied. Please allow microphone permission and try again.');
        break;
      case 'no-speech':
        showError('No speech was detected. Please try again.');
        break;
      case 'audio-capture':
        showError('No microphone was found. Please connect a microphone and try again.');
        break;
      case 'network':
        showError('A network error occurred. Please check your internet connection.');
        break;
      default:
        showError('An error occurred: ' + event.error);
    }
  };

  // ----- Start / Stop button (id="startBtn") -----
  startBtn.addEventListener('click', function () {
    if (!isListening) {
      // Starting fresh: reset transcript buffer so old text isn't duplicated
      try {
        clearError();
        recognition.start();
      } catch (err) {
        showError('Unable to start recording: ' + err.message);
      }
    } else {
      recognition.stop();
    }
  });
}

// ----- "Clear Text" button (id="copyBtn" in the HTML) -----
clearActionBtn.addEventListener('click', function () {
  transcriptEl.value = '';
  finalTranscript = '';
  clearError();
});

// ----- "Copy Text" button (id="clearBtn" in the HTML) -----
copyActionBtn.addEventListener('click', function () {
  const text = transcriptEl.value;

  if (!text.trim()) {
    showError('There is no text to copy yet.');
    return;
  }

  navigator.clipboard.writeText(text)
    .then(function () {
      clearError();
      const originalText = copyActionBtn.textContent;
      copyActionBtn.textContent = 'Copied!';
      setTimeout(function () {
        copyActionBtn.textContent = originalText;
      }, 1200);
    })
    .catch(function () {
      showError('Failed to copy text to clipboard.');
    });
}); 