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
  const [wheelRotation, setWheelRotation] = useState(0);

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
    if (isSpinning) return;
    
    setIsSpinning(true);
    setShowResult(false);
    setAnimationStep(0);
    setWheelRotation(0);

    // Simulate spinning animation with realistic physics
    const spinDuration = 3000;
    const startTime = Date.now();
    
    const animateSpin = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / spinDuration;
      
      // Easing function for realistic deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = easeOut * 1440; // 4 full rotations
      
      setWheelRotation(currentRotation);
      
      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        // Spin complete
        const points = getRandomPoints();
        setEarnedPoints(points);
        setShowResult(true);
        setIsSpinning(false);
        
        // Trigger points integration animation
        setTimeout(() => {
          setAnimationStep(1);
          onPointsEarned(points);
        }, 1500);
      }
    };
    
    requestAnimationFrame(animateSpin);
  };

  const handleClose = () => {
    if (!isSpinning) {
      onClose();
      setShowResult(false);
      setEarnedPoints(0);
      setAnimationStep(0);
      setWheelRotation(0);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setShowResult(false);
      setEarnedPoints(0);
      setAnimationStep(0);
      setWheelRotation(0);
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
            <h2>Reclamar Puntos Diarios</h2>
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
                    <div className="wheel-segment-1"></div>
                    <div className="wheel-segment-2"></div>
                    <div className="wheel-segment-3"></div>
                    <div className="wheel-segment-4"></div>
                    <div className="wheel-segment-5"></div>
                    {/* Numbers positioned correctly on each segment */}
                    <div style={{
                      position: 'absolute',
                      top: '14%',
                      left: '30%',
                      transform: 'translateX(-50%)',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '16px',
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                      zIndex: 5
                    }}>1</div>
                    <div style={{
                      position: 'absolute',
                      top: '15%',
                      right: '28%',
                      color: 'black',
                      fontWeight: '700',
                      fontSize: '16px',
                      textShadow: '0 1px 3px rgba(255, 255, 255, 0.8)',
                      zIndex: 5
                    }}>2</div>
                    <div style={{
                      position: 'absolute',
                      bottom: '32%',
                      right: '8%',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '16px',
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                      zIndex: 5
                    }}>3</div>
                    <div style={{
                      position: 'absolute',
                      bottom: '8%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '16px',
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                      zIndex: 5
                    }}>4</div>
                    <div style={{
                      position: 'absolute',
                      top: '54%',
                      left: '7%',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '16px',
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                      zIndex: 5
                    }}>5</div>
                  </div>
                </div>
                <button 
                  className="daily-points-spin-button"
                  onClick={handleSpin}
                  disabled={isSpinning}
                >
                  ¡GIRAR!
                </button>
              </div>
            ) : null}

            {isSpinning && (
              <div className="daily-points-spinning">
                <div 
                  className="daily-points-wheel spinning"
                  style={{ transform: `rotate(${wheelRotation}deg)` }}
                >
                  <div className="daily-points-wheel-center">
                    <div className="daily-points-wheel-pointer"></div>
                  </div>
                  <div className="daily-points-wheel-segments">
                    <div className="wheel-segment-1"></div>
                    <div className="wheel-segment-2"></div>
                    <div className="wheel-segment-3"></div>
                    <div className="wheel-segment-4"></div>
                    <div className="wheel-segment-5"></div>
                    {/* Numbers positioned correctly on each segment */}
                    <div style={{
                      position: 'absolute',
                      top: '14%',
                      left: '30%',
                      transform: 'translateX(-50%)',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '16px',
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                      zIndex: 5
                    }}>1</div>
                    <div style={{
                      position: 'absolute',
                      top: '15%',
                      right: '28%',
                      color: 'black',
                      fontWeight: '700',
                      fontSize: '16px',
                      textShadow: '0 1px 3px rgba(255,255,255,0.8)',
                      zIndex: 5
                    }}>2</div>
                    <div style={{
                      position: 'absolute',
                      bottom: '32%',
                      right: '8%',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '16px',
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                      zIndex: 5
                    }}>3</div>
                    <div style={{
                      position: 'absolute',
                      bottom: '8%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '16px',
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                      zIndex: 5
                    }}>4</div>
                    <div style={{
                      position: 'absolute',
                      top: '54%',
                      left: '7%',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '16px',
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                      zIndex: 5
                    }}>5</div>
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
                          animationDelay: `${index * 0.15}s`
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
        </div>
      </div>
    </div>
  );
};

export default DailyPointsModal;
