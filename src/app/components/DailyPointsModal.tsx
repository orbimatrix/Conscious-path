'use client';

import React, { useState, useEffect } from 'react';
import './DailyPointsModal.css';

interface DailyPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPointsEarned: (points: number) => void;
  currentPoints: number;
  lastDailyClaim?: string;
}

const DailyPointsModal: React.FC<DailyPointsModalProps> = ({
  isOpen,
  onClose,
  onPointsEarned,
  currentPoints,
  lastDailyClaim
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // Check if user can claim daily points
  const canClaim = () => {
    if (!lastDailyClaim) return true;
    
    const lastClaim = new Date(lastDailyClaim);
    const now = new Date();
    const timeDiff = now.getTime() - lastClaim.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return hoursDiff >= 24;
  };

  // Calculate time until next claim
  const getTimeUntilNextClaim = () => {
    if (!lastDailyClaim) return null;
    
    const lastClaim = new Date(lastDailyClaim);
    const now = new Date();
    const nextClaim = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);
    const timeDiff = nextClaim.getTime() - now.getTime();
    
    if (timeDiff <= 0) return null;
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };

  // Probability distribution for points
  const getRandomPoints = (): number => {
    const random = Math.random() * 100;
    if (random < 75) return 1;      // 75% probability
    if (random < 89) return 2;      // 14% probability
    if (random < 95) return 3;      // 6% probability
    if (random < 99) return 4;      // 4% probability
    return 5;                        // 1% probability
  };

  const handleSpin = () => {
    setIsSpinning(true);
    setShowResult(false);
    setAnimationStep(0);

    // Simulate spinning animation
    setTimeout(() => {
      const points = getRandomPoints();
      setEarnedPoints(points);
      setShowResult(true);
      setIsSpinning(false);
      
      // Trigger points integration animation
      setTimeout(() => {
        setAnimationStep(1);
        onPointsEarned(points);
      }, 2000);
    }, 3000);
  };

  const handleClose = () => {
    if (!isSpinning) {
      onClose();
      setShowResult(false);
      setEarnedPoints(0);
      setAnimationStep(0);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setShowResult(false);
      setEarnedPoints(0);
      setAnimationStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="daily-points-modal-overlay" onClick={handleClose}>
      <div className="daily-points-modal" onClick={(e) => e.stopPropagation()}>
        <div className="daily-points-modal-content">
          <button className="daily-points-modal-close" onClick={handleClose}>
            ×
          </button>
          
          <div className="daily-points-modal-header">
            <h2>🎁 Reclamar Puntos Diarios</h2>
            <p>¡Gira la ruleta y obtén puntos aleatorios!</p>
          </div>

          <div className="daily-points-modal-body">
            {!canClaim() ? (
              <div className="daily-points-cooldown">
                <div className="cooldown-icon">⏰</div>
                <h3>Ya reclamaste tus puntos de hoy</h3>
                <p>Vuelve mañana para obtener más puntos</p>
                {(() => {
                  const timeLeft = getTimeUntilNextClaim();
                  if (timeLeft) {
                    return (
                      <div className="cooldown-timer">
                        <span>Próximo claim disponible en:</span>
                        <div className="timer-display">
                          <span className="timer-hours">{timeLeft.hours}h</span>
                          <span className="timer-minutes">{timeLeft.minutes}m</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
                <button 
                  className="daily-points-close-button"
                  onClick={handleClose}
                >
                  Cerrar
                </button>
              </div>
            ) : !showResult && !isSpinning ? (
              <div className="daily-points-spin-section">
                <div className="daily-points-wheel">
                  <div className="daily-points-wheel-center">
                    <div className="daily-points-wheel-pointer"></div>
                  </div>
                  <div className="daily-points-wheel-segments">
                    <div className="wheel-segment" data-points="1">1</div>
                    <div className="wheel-segment" data-points="2">2</div>
                    <div className="wheel-segment" data-points="3">3</div>
                    <div className="wheel-segment" data-points="4">4</div>
                    <div className="wheel-segment" data-points="5">5</div>
                  </div>
                </div>
                <button 
                  className="daily-points-spin-button"
                  onClick={handleSpin}
                >
                  ¡GIRAR!
                </button>
              </div>
            ) : null}

            {isSpinning && (
              <div className="daily-points-spinning">
                <div className="daily-points-wheel spinning">
                  <div className="daily-points-wheel-center">
                    <div className="daily-points-wheel-pointer"></div>
                  </div>
                  <div className="daily-points-wheel-segments">
                    <div className="wheel-segment" data-points="1">1</div>
                    <div className="wheel-segment" data-points="2">2</div>
                    <div className="wheel-segment" data-points="3">3</div>
                    <div className="wheel-segment" data-points="4">4</div>
                    <div className="wheel-segment" data-points="5">5</div>
                  </div>
                </div>
                <p>¡Girando la ruleta...</p>
              </div>
            )}

            {showResult && (
              <div className="daily-points-result">
                <div className="daily-points-result-animation">
                  <div className="points-particle-container">
                    {[...Array(earnedPoints)].map((_, index) => (
                      <div 
                        key={index} 
                        className={`points-particle particle-${index + 1}`}
                        style={{
                          animationDelay: `${index * 0.2}s`
                        }}
                      >
                        ⭐
                      </div>
                    ))}
                  </div>
                  <div className="earned-points-display">
                    <span className="earned-points-number">+{earnedPoints}</span>
                    <span className="earned-points-label">puntos</span>
                  </div>
                </div>
                
                {animationStep >= 1 && (
                  <div className="points-integration-animation">
                    <div className="integration-arrow">↓</div>
                    <div className="integration-text">
                      Integrando a tu cuenta...
                    </div>
                    <div className="final-points-display">
                      Total: {currentPoints + earnedPoints} puntos
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="daily-points-modal-footer">
            <div className="daily-points-probabilities">
              <h4>Probabilidades:</h4>
              <div className="probability-list">
                <span>1 punto: 75%</span>
                <span>2 puntos: 14%</span>
                <span>3 puntos: 6%</span>
                <span>4 puntos: 4%</span>
                <span>5 puntos: 1%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyPointsModal;
