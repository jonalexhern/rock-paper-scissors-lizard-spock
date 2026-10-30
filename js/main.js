// Five possible moves for the game
const choices = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
//mapping each move to its emoji
const emojis = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️',
  lizard: '🦎',
  spock: '🖖'
};

// What beats what, flavor text
const beats = {
  rock: {
    scissors: 'Rock crushes Scissors',
    lizard: 'Rock crushes Lizard'
  },
  paper: {
    rock: 'Paper covers Rock',
    spock: 'Paper disproves Spock'
  },
  scissors: {
    paper: 'Scissors cuts Paper',
    lizard: 'Scissors decapitates Lizard'
  },
  lizard: {
    paper: 'Lizard eats Paper',
    spock: 'Lizard poisons Spock'
  },
  spock: {
    rock: 'Spock vaporizes Rock',
    scissors: 'Spock smashes Scissors'
  }
};

let p1Score = 0;
let p2Score = 0;
let tieScore = 0;
let p1Choice = null;
let p2Choice = null;
// PHASES: 'p1-privacy' -> 'p1' -> 'pass-to-p2' -> 'p2' -> 'ready-results' -> 'result' and loop
let phase = 'p1-privacy';

// Important DOM nodes stored at the start.
const p1ScoreEl = document.getElementById('p1-score');
const p2ScoreEl = document.getElementById('p2-score');
const tieScoreEl = document.getElementById('tie-score');
const turnIndicator = document.getElementById('turn-indicator');
const resultArea = document.getElementById('result-area');
const choicesArea = document.getElementById('choices-area');
const buttons = document.querySelectorAll('.choice-btn');
const confirmBtn = document.getElementById('confirm-btn');
const finalBtn = document.getElementById('final-btn');
const nextBtn = document.getElementById('next-btn');
const resetBtn = document.getElementById('reset-btn');
const rulesLink = document.getElementById('rules-link');
const rulesModal = document.getElementById('rules-modal');
const modalClose = document.getElementById('modal-close');

// Show or hide the five choices and enables/disables them.
function setChoicesVisible(visible) {
  if (visible) {
    choicesArea.classList.remove('hidden');
    buttons.forEach(btn => btn.disabled = false);
  } else {
    choicesArea.classList.add('hidden');
    buttons.forEach(btn => btn.disabled = true);
  }
}

// Hides buttons so they're only shown when needed.
function hideAllActionBtns() {
  confirmBtn.style.display = 'none';
  finalBtn.style.display = 'none';
  nextBtn.style.display = 'none';
}

// Setting the phase, updating text, showing/hiding the choice buttons.
// Phase 1
function renderPrivacyWarn() {
  phase = 'p1-privacy';
  turnIndicator.textContent = 'PRIVACY CHECK';
  turnIndicator.className = 'turn-indicator warn';
  resultArea.innerHTML = `
    <div class="message-box">
      <strong>PLAYER 1</strong><br><br>
      Make sure only YOU can see this screen.<br>
      Keep it away from Player 2<br>
      while you choose.
    </div>
  `;
  setChoicesVisible(false);
  hideAllActionBtns();
  confirmBtn.style.display = 'inline-block';
  confirmBtn.textContent = 'CONFIRM';
}

// Phase 2
function renderP1Turn() {
  phase = 'p1';
  turnIndicator.textContent = 'PLAYER 1 IS CHOOSING...';
  turnIndicator.className = 'turn-indicator';
  resultArea.innerHTML = `
    <div class="vs">
      <div class="pick">
        <span class="pick-label p1">P1</span>
        <span class="pick-emoji" style="color: var(--p1);">❓</span>
      </div>
      <span class="vs-text">VS.</span>
      <div class="pick">
        <span class="pick-label p2">P2</span>
        <span class="pick-emoji" style="color: var(--p2);">❓</span>
      </div>
    </div>
  `;
  setChoicesVisible(true);
  hideAllActionBtns();
}

// Phase 3
function renderPassToP2() {
  phase = 'pass-to-p2';
  turnIndicator.textContent = 'PASS THE DEVICE';
  turnIndicator.className = 'turn-indicator warn';
  resultArea.innerHTML = `
    <div class="message-box">
      <strong>PLAYER 1</strong> has chosen.<br><br>
      Please pass the screen<br>
      to <strong>PLAYER 2</strong>.
    </div>
  `;
  setChoicesVisible(false);
  hideAllActionBtns();
  confirmBtn.style.display = 'inline-block';
  confirmBtn.textContent = 'CONFIRM';
}

// Phase 4
function renderP2Turn() {
  phase = 'p2';
  turnIndicator.textContent = 'PLAYER 2 IS CHOOSING...';
  turnIndicator.className = 'turn-indicator p2';
  resultArea.innerHTML = `
    <div class="vs">
      <div class="pick">
        <span class="pick-label p1">P1</span>
        <span class="pick-emoji" style="color: var(--p1);">❓</span>
      </div>
      <span class="vs-text">VS.</span>
      <div class="pick">
        <span class="pick-label p2">P2</span>
        <span class="pick-emoji" style="color: var(--p2);">❓</span>
      </div>
    </div>
  `;
  setChoicesVisible(true);
  hideAllActionBtns();
}

// Phase 5
function renderReadyResults() {
  phase = 'ready-results';
  turnIndicator.textContent = 'BOTH PLAYERS READY?';
  turnIndicator.className = 'turn-indicator warn';
  resultArea.innerHTML = `
    <div class="message-box">
      Both players have chosen!<br><br>
      Gather around the screen<br>
      then press the button below<br>
      to reveal the results.
    </div>
  `;
  setChoicesVisible(false);
  hideAllActionBtns();
  finalBtn.style.display = 'inline-block';
}

// Phase 6
function showResult() {
  phase = 'result';
  setChoicesVisible(false);
  hideAllActionBtns();
  nextBtn.style.display = 'inline-block';

  let result, resultClass, reason = '';

  // Who wins?
  if (p1Choice === p2Choice) {
    result = "IT'S A TIE!";
    resultClass = 'draw';
    tieScore++;
    tieScoreEl.textContent = tieScore;
  } else if (beats[p1Choice] && beats[p1Choice][p2Choice]) {
    result = 'PLAYER 1 WINS!';
    resultClass = 'win';
    reason = beats[p1Choice][p2Choice];
    p1Score++;
    p1ScoreEl.textContent = p1Score;
  } else {
    result = 'PLAYER 2 WINS!';
    resultClass = 'win';
    reason = beats[p2Choice][p1Choice];
    p2Score++;
    p2ScoreEl.textContent = p2Score;
  }

  turnIndicator.textContent = 'RESULT';
  turnIndicator.className = 'turn-indicator result';

  resultArea.innerHTML = `
    <div class="vs">
      <div class="pick">
        <span class="pick-label p1">P1</span>
        <span class="pick-emoji">${emojis[p1Choice]}</span>
      </div>
      <span class="vs-text">VS.</span>
      <div class="pick">
        <span class="pick-label p2">P2</span>
        <span class="pick-emoji">${emojis[p2Choice]}</span>
      </div>
    </div>
    <div class="result-text ${resultClass}">${result}</div>
    ${reason ? `<div class="reason">${reason}</div>` : ''}
  `;
}

// Switching to p2 and final results phases
function handleChoice(choice) {
  if (phase === 'p1') {
    p1Choice = choice;
    renderPassToP2();
  } else if (phase === 'p2') {
    p2Choice = choice;
    renderReadyResults();
  }
}

function startNextRound() {
  p1Choice = null;
  p2Choice = null;
  renderPrivacyWarn();
}

// All the Event Listeners
confirmBtn.addEventListener('click', () => {
  if (phase === 'p1-privacy') {
    renderP1Turn();
  } else if (phase === 'pass-to-p2') {
    renderP2Turn();
  }
});

finalBtn.addEventListener('click', () => {
  if (phase === 'ready-results') {
    showResult();
  }
});

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (phase !== 'p1' && phase !== 'p2') return;
    handleChoice(btn.dataset.choice);
  });
});

nextBtn.addEventListener('click', startNextRound);

resetBtn.addEventListener('click', () => {
  p1Score = 0;
  p2Score = 0;
  tieScore = 0;
  p1ScoreEl.textContent = '0';
  p2ScoreEl.textContent = '0';
  tieScoreEl.textContent = '0';
  startNextRound();
});

// Rules modal
rulesLink.addEventListener('click', () => {
  rulesModal.classList.add('open');
});
modalClose.addEventListener('click', () => {
  rulesModal.classList.remove('open');
});
rulesModal.addEventListener('click', (e) => {
  if (e.target === rulesModal) rulesModal.classList.remove('open');
});

// Initial state
renderPrivacyWarn();