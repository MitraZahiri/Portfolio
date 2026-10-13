import { useState } from 'react'
import MuseumScene from './components/MuseumScene'
import { EXHIBITS } from './data/exhibitsData'
import { Sparkles, X, ExternalLink, ArrowDown } from 'lucide-react'
import './index.css'

export default function App() {
  const [selectedExhibit, setSelectedExhibit] = useState(null)
  const [depthMeter, setDepthMeter] = useState('0.0')
  const [scrollPercent, setScrollPercent] = useState(0)

  // Update camera depth and scroll progress
  const handleScrollProgress = (offset, cameraZ) => {
    setScrollPercent(Math.round(offset * 100))
    setDepthMeter(Math.abs(cameraZ).toFixed(1))
  }

  return (
    <main className="antigravity-museum-app">
      {/* 3D Antigravity R3F Scene */}
      <MuseumScene
        onSelectExhibit={(exhibit) => setSelectedExhibit(exhibit)}
        onScrollProgress={handleScrollProgress}
      />

      {/* =========================================================
          MINIMALIST HUD (HEADS-UP DISPLAY) LAYER
         ========================================================= */}
      <div className="museum-hud-layer">
        {/* Top Navigation & Telemetry Bar */}
        <header className="hud-header">
          <div className="museum-logo">
            <span className="logo-symbol">MZ</span>
            <div className="logo-meta">
              <h1 className="logo-title">MITRA ZAHIRI</h1>
              <p className="logo-sub">THE DIGITAL MUSEUM</p>
            </div>
          </div>

          <div className="telemetry-box">
            <span className="pulse-indicator" />
            <span className="telemetry-label">DEPTH:</span>
            <span className="telemetry-val">-{depthMeter}m</span>
            <span className="divider">/</span>
            <span className="telemetry-pct">{scrollPercent}% EXPLORED</span>
          </div>
        </header>

        {/* Right Depth Rail Track */}
        <div className="depth-rail-track" aria-hidden="true">
          <div
            className="depth-rail-thumb"
            style={{ height: `${Math.max(6, scrollPercent)}%` }}
          />
        </div>

        {/* Bottom Navigation & Stroll Hint */}
        <footer className="hud-footer">
          <div className="footer-exhibits-list">
            {EXHIBITS.map((item, idx) => (
              <span
                key={item.id}
                className="exhibit-pill"
                onClick={() => setSelectedExhibit(item)}
              >
                <span className="pill-num">0{idx + 1}</span>
                <span className="pill-name">{item.title}</span>
              </span>
            ))}
          </div>

          <div className="scroll-hint-bar">
            <span>SCROLL OR DRAG TO STROLL</span>
            <ArrowDown size={14} className="bounce-arrow" />
          </div>
        </footer>
      </div>

      {/* =========================================================
          EXHIBIT CURATORIAL DOSSIER MODAL
         ========================================================= */}
      {selectedExhibit && (
        <div
          className="exhibit-modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedExhibit(null)}
        >
          <article
            className="exhibit-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              borderColor: selectedExhibit.glowColor,
              boxShadow: `0 0 50px rgba(0, 0, 0, 0.9), 0 0 35px ${selectedExhibit.color}40`,
            }}
          >
            <button
              type="button"
              className="modal-close-button"
              onClick={() => setSelectedExhibit(null)}
              aria-label="Close"
            >
              <X size={18} />
              <span>ESC</span>
            </button>

            <div className="modal-header">
              <span
                className="modal-number-badge"
                style={{ color: selectedExhibit.glowColor }}
              >
                EXHIBIT // NO. {selectedExhibit.number}
              </span>
              <h2 className="modal-title">{selectedExhibit.title}</h2>
              <p className="modal-subtitle">{selectedExhibit.subtitle}</p>
            </div>

            <div className="modal-body">
              <p className="modal-desc">{selectedExhibit.description}</p>

              <div className="modal-tech-box">
                <span className="section-label">CURATORIAL FIELD & DOMAIN</span>
                <div className="tech-badge-row">
                  <span
                    className="tech-badge"
                    style={{
                      borderColor: `${selectedExhibit.glowColor}60`,
                      color: selectedExhibit.glowColor,
                    }}
                  >
                    <Sparkles size={12} />
                    {selectedExhibit.category}
                  </span>
                </div>
              </div>
            </div>

            <footer className="modal-footer">
              <button
                type="button"
                className="action-btn"
                style={{
                  backgroundColor: selectedExhibit.color,
                  color: '#05070d',
                }}
                onClick={() => setSelectedExhibit(null)}
              >
                <span>RETURN TO GALLERY</span>
              </button>

              <a
                href="https://github.com/MitraZahiri/Portfolio"
                target="_blank"
                rel="noopener noreferrer"
                class="github-btn"
              >
                <ExternalLink size={15} />
                <span>GITHUB ARCHIVE</span>
              </a>
            </footer>
          </article>
        </div>
      )}
    </main>
  )
}
