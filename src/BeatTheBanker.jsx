import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import './style.css';

const PRIZES = {
  Whale: [1, 5, 10, 15, 30, 99, 100, 149, 299, 399, 450, 499, 500, 600, 700, 800, 900, 1000, 1100, 1300, 1500, 1700, 1900, 2150],
  DiamondGun: [99, 149, 299, 399, 500, 550, 600, 650, 700, 750, 800, 900, 1000, 1100, 1200, 1400, 1600, 1800, 2500, 3000, 3500, 4000, 4500, 5000],
  Leopard: [500, 600, 700, 800, 900, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 8000, 9000, 10000, 12000, 14000, 15000],
  Universe: [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000, 10000, 12000, 15000, 16000, 18000, 20000, 23000, 25000, 27000, 29000, 31000, 34000, 40000, 44999],
};

const BeatTheBanker = () => {
  const rounds = [6, 5, 4, 3, 2, 1, 1];
  const modifiers = [0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9];

  const [prizeMode, setPrizeMode] = useState('Whale');
  const [shuffledPrizes, setShuffledPrizes] = useState([]);
  const [openedCases, setOpenedCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [finalPrize, setFinalPrize] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const [currentRound, setCurrentRound] = useState(0);
  const [casesOpenedThisRound, setCasesOpenedThisRound] = useState(0);
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [bankerOffer, setBankerOffer] = useState(null);
  const [bankerMessage, setBankerMessage] = useState("");
  const [showSwapPopup, setShowSwapPopup] = useState(false);

  useEffect(() => {
    resetGame();
  }, [prizeMode]);

  const resetGame = () => {
    const shuffled = [...PRIZES[prizeMode]].sort(() => Math.random() - 0.5);
    setShuffledPrizes(shuffled);
    setOpenedCases([]);
    setSelectedCase(null);
    setFinalPrize(null);
    setShowConfetti(false);
    setCurrentRound(0);
    setCasesOpenedThisRound(0);
    setShowOfferPopup(false);
    setBankerOffer(null);
    setBankerMessage("");
    setShowSwapPopup(false);
  };

  const handleCaseClick = (i) => {
    if (openedCases.includes(i) || showOfferPopup || finalPrize !== null) return;

    if (selectedCase === null) {
      setSelectedCase(i);
      return;
    }

    if (i === selectedCase) return;

    const newOpened = [...openedCases, i];
    setOpenedCases(newOpened);
    const nextCount = casesOpenedThisRound + 1;
    setCasesOpenedThisRound(nextCount);

    if (nextCount === rounds[currentRound]) {
      const remaining = shuffledPrizes.filter((_, idx) => !newOpened.includes(idx) && idx !== selectedCase);
      const average = remaining.reduce((a, b) => a + b, 0) / remaining.length;
      const offer = Math.floor(average * modifiers[currentRound]);
      setBankerOffer(offer);

      const remarks = [
        "You're not built for this money... take the deal.",
        "That case you're holding? Feels empty.",
        "You could walk away rich... or broke.",
        "Even your mom would take this deal.",
        "You really gonna gamble this away?",
        "Think fast. You're one case from regret."
      ];

      setBankerMessage(remarks[Math.floor(Math.random() * remarks.length)]);
      setShowOfferPopup(true);
    }

    if (newOpened.length === 22) {
  const unopenedCases = [...Array(24).keys()].filter(i => !newOpened.includes(i) && i !== selectedCase);
  if (unopenedCases.length === 1) {
    setShowSwapPopup(true);
  }
}
  };

  const handleSwapDecision = (swap) => {
  const lastRemainingCase = [...Array(24).keys()].find(
    (i) => !openedCases.includes(i) && i !== selectedCase
  );

  if (lastRemainingCase === undefined || selectedCase === null) return;

  const finalCase = swap ? lastRemainingCase : selectedCase;
  setFinalPrize(shuffledPrizes[finalCase]);
  setShowConfetti(true);
  new Audio('/win-sound.mp3').play();
  setTimeout(() => setShowConfetti(false), 3000);
  setShowSwapPopup(false);
};

  const sortedPrizes = [...shuffledPrizes].sort((a, b) => a - b);
  const revealedValues = openedCases.map(i => shuffledPrizes[i]);

  return (
    <div className="game-container">
      {showConfetti && <Confetti />}
      <img src="/logo.png" className="game-logo" alt="Game Logo" />

      <div className="layout-with-prizes">
        <div className="prize-board">
          <div className="prize-column left">
            {sortedPrizes.slice(0, 12).map((value, i) => (
              <div key={`low-${i}`} className={`prize-value-box ${revealedValues.includes(value) ? 'dimmed' : ''}`}>
                💎{value}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="case-grid">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className={`case ${i === selectedCase ? 'selected' : ''}`} onClick={() => handleCaseClick(i)}>
                <img src={openedCases.includes(i) ? '/briefcase-open.png' : '/briefcase-closed.png'} alt={`Case ${i + 1}`} />
                <span className="case-number">{i + 1}</span>
                {openedCases.includes(i) && <span className="prize-value">💎{shuffledPrizes[i]}</span>}
              </div>
            ))}
          </div>

          {selectedCase === null ? (
            <div className="case-counter">Pick your case to keep until the end!</div>
          ) : finalPrize === null ? (
            <div className="case-counter">Open {rounds[currentRound] - casesOpenedThisRound} more cases</div>
          ) : null}

          <div className="prize-mode-selector">
            <label>Select Prize Mode:</label>
            <select value={prizeMode} onChange={(e) => setPrizeMode(e.target.value)}>
              {Object.keys(PRIZES).map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>

          <div className="prize-mode-selector">
            <button onClick={resetGame}>Reset Game</button>
          </div>

          {finalPrize !== null && (
            <div className="banker-popup">
              <h3>💼 You Won 💎{finalPrize}!</h3>
              <button onClick={resetGame}>Play Again</button>
            </div>
          )}

          {showOfferPopup && (
            <div className="banker-popup">
              <p>{bankerMessage}</p>
              <h3>Banker's Offer: 💎{bankerOffer}</h3>
              <button className="accept" onClick={() => {
                setFinalPrize(bankerOffer);
                setShowConfetti(true);
                new Audio('/win-sound.mp3').play();
                setShowOfferPopup(false);
              }}>Take the Deal</button>
              <button className="decline" onClick={() => {
                setShowOfferPopup(false);
                setCasesOpenedThisRound(0);
                setCurrentRound(prev => prev + 1);
              }}>No Deal</button>
            </div>
          )}

          {showSwapPopup && (
            <div className="banker-popup">
              <h3>Final Choice:</h3>
              <p>Do you want to keep your case or swap it with the last remaining case?</p>
              <button onClick={() => handleSwapDecision(false)}>Keep My Case</button>
              <button onClick={() => handleSwapDecision(true)}>Swap Case</button>
            </div>
          )}
        </div>

        <div className="prize-board">
          <div className="prize-column right">
            {sortedPrizes.slice(12).map((value, i) => (
              <div key={`high-${i}`} className={`prize-value-box ${revealedValues.includes(value) ? 'dimmed' : ''}`}>
                💎{value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeatTheBanker;
