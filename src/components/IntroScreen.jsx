import { useState, useEffect } from 'react'
import { Volume2, Compass, ArrowRight } from 'lucide-react'

export default function IntroScreen({ onEnter }) {
  const [loadingCounter, setLoadingCounter] = useState(0)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Cinematic countdown / loading simulation (000 -> 100)
    let current = 0
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 4
      if (current >= 100) {
        current = 100
        clearInterval(interval)
        setIsReady(true)
      }
      setLoadingCounter(current)
    }, 45)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="intro-screen-overlay">
      <div className="intro-backdrop-vignette" />

      <div className="intro-content">
        {/* Counter Badge */}
        <div className="intro-counter">
          <span>{loadingCounter.toString().padStart(3, '0')}</span>
          <span className="counter-label">% CATALOGUE LOADED</span>
        </div>

        {/* Grand Typography */}
        <div className="intro-titles">
          <span className="sub-title-arch">SANCTUARY OF SPATIAL COMPUTING & CODE</span>
          <h1 className="main-title">THE MUSEUM OF CODE</h1>
          <p className="curator-byline">
            CURATED BY <strong>MITRA ZAHIRI</strong>
          </p>
        </div>

        {/* Architectural Divider */}
        <div className="arch-divider">
          <span className="line" />
          <span className="diamond" />
          <span className="line" />
        </div>

        {/* Experience Recommendation (Sound & Navigation) */}
        <div className="experience-advisory">
          <div className="advisory-pill">
            <Volume2 size={15} />
            <span>Harmonic Generative Ambience Included</span>
          </div>
          <div className="advisory-pill">
            <Compass size={15} />
            <span>Scroll or Drag to Walk Through 6 Galleries</span>
          </div>
        </div>

        {/* Enter Button */}
        <div className="enter-action-container">
          <button
            type="button"
            className={`enter-museum-btn ${isReady ? 'ready' : 'loading'}`}
            disabled={!isReady}
            onClick={onEnter}
          >
            <span>{isReady ? 'ENTER THE EXHIBITION' : 'PREPARING ARCHIVE...'}</span>
            <ArrowRight size={18} className="arrow-icon" />
          </button>
        </div>

        <div className="intro-footer-notes">
          <span>EXHIBITION NO. 2026 // WEBGL 2.0 • 60 FPS • SPATIAL RAIL</span>
        </div>
      </div>
    </div>
  )
}
