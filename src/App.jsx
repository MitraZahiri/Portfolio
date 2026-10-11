import { useState } from 'react'
import MuseumScene from './components/MuseumScene'
import { EXHIBITS } from './data/exhibitsData'
import { Sparkles, X, ExternalLink, ArrowDown } from 'lucide-react'
import './index.css'

export default function App() {
  const [selectedExhibit, setSelectedExhibit] = useState(null)
  const [depthMeter, setDepthMeter] = useState('0.0')
  const [scrollPercent, setScrollPercent] = useState(0)

  // Kamera derinliği ve scroll ilerlemesini güncelle
  const handleScrollProgress = (offset, cameraZ) => {
    setScrollPercent(Math.round(offset * 100))
    setDepthMeter(Math.abs(cameraZ).toFixed(1))
  }

  return (
    <main className="antigravity-museum-app">
      {/* 3D Yerçekimsiz R3F Sahnesi */}
      <MuseumScene
        onSelectExhibit={(exhibit) => setSelectedExhibit(exhibit)}
        onScrollProgress={handleScrollProgress}
      />

      {/* =========================================================
          MİNİMALİST HUD (HEADS-UP DISPLAY) KATMANI
         ========================================================= */}
      <div className="museum-hud-layer">
        {/* Üst Navigasyon ve Telemetri Çubuğu */}
        <header className="hud-header">
          <div className="museum-logo">
            <span className="logo-symbol">AG</span>
            <div className="logo-meta">
              <h1 className="logo-title">ANTIGRAVITY MUSEUM</h1>
              <p className="logo-sub">YERÇEKİMSİZ 3D PORTFOLYO</p>
            </div>
          </div>

          <div className="telemetry-box">
            <span className="pulse-indicator" />
            <span className="telemetry-label">DERİNLİK:</span>
            <span className="telemetry-val">-{depthMeter}m</span>
            <span className="divider">/</span>
            <span className="telemetry-pct">%{scrollPercent} KEŞİF</span>
          </div>
        </header>

        {/* Sağ Kenar İlerleme Çubuğu */}
        <div className="depth-rail-track" aria-hidden="true">
          <div
            className="depth-rail-thumb"
            style={{ height: `${Math.max(6, scrollPercent)}%` }}
          />
        </div>

        {/* Alt Bilgi ve Gezinti Rehberi */}
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
            <span>AŞAĞI KAYDIR VE UZAYDA SÜZÜL</span>
            <ArrowDown size={14} className="bounce-arrow" />
          </div>
        </footer>
      </div>

      {/* =========================================================
          ESER İNCELEME MODALI (SEÇİLDİĞİNDE AÇILIR)
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
              aria-label="Kapat"
            >
              <X size={18} />
              <span>ESC</span>
            </button>

            <div className="modal-header">
              <span
                className="modal-number-badge"
                style={{ color: selectedExhibit.glowColor }}
              >
                ESER // NO. {selectedExhibit.number}
              </span>
              <h2 className="modal-title">{selectedExhibit.title}</h2>
              <p className="modal-subtitle">{selectedExhibit.subtitle}</p>
            </div>

            <div className="modal-body">
              <p className="modal-desc">{selectedExhibit.description}</p>

              <div className="modal-tech-box">
                <span className="section-label">UZMANLIK ALANI & KATEGORİ</span>
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
                <span>MÜZEYE DÖN</span>
              </button>

              <a
                href="https://github.com/MitraZahiri/Portfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="github-btn"
              >
                <ExternalLink size={15} />
                <span>GITHUB PROJESİ</span>
              </a>
            </footer>
          </article>
        </div>
      )}
    </main>
  )
}
