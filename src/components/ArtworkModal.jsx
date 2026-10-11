import { useEffect } from 'react'
import { X, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react'

function GithubIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  )
}

export default function ArtworkModal({ exhibit, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!exhibit) return null

  return (
    <div
      className="artwork-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="artwork-title"
    >
      <div className="artwork-modal-card">
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close Artwork Inspection"
        >
          <X size={20} />
          <span>ESC</span>
        </button>

        <div className="modal-content-grid">
          {/* Left: Artwork Canvas View */}
          <div className="modal-image-column">
            {exhibit.image ? (
              <div className="framed-artwork-wrapper">
                <div className="gilded-frame-border">
                  <img
                    src={exhibit.image}
                    alt={exhibit.title}
                    className="modal-artwork-img"
                  />
                  <div className="canvas-sheen" />
                </div>
                <div className="gallery-placard-brass">
                  <span className="placard-catalogue">{exhibit.plaqueTitle || 'EXHIBIT CATALOGUE'}</span>
                  <span className="placard-medium">Oil & Shader on WebGL Canvas • {exhibit.year}</span>
                </div>
              </div>
            ) : (
              <div className="artifact-sculpture-presentation">
                <div className="sculpture-ring-glow" />
                <div className="sculpture-title-badge">
                  <Sparkles size={24} className="gold-icon" />
                  <h4>{exhibit.title}</h4>
                  <p>{exhibit.subtitle}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Curatorial Critique & Architectural Dossier */}
          <div className="modal-details-column">
            <div className="curatorial-header">
              <span className="hall-tag">{exhibit.hall || exhibit.subtitle}</span>
              <h2 id="artwork-title" className="artwork-heading">
                {exhibit.title}
              </h2>
              <p className="lead-manifesto">{exhibit.leadQuote}</p>
            </div>

            {/* Description */}
            <div className="curatorial-critique">
              <h4 className="section-title">CURATORIAL ANALYSIS</h4>
              <p className="critique-body">{exhibit.description}</p>
            </div>

            {/* Performance & Metrics */}
            {exhibit.metrics && (
              <div className="metrics-box">
                <h4 className="section-title">PERFORMANCE TELEMETRY</h4>
                <div className="metrics-tags">
                  {exhibit.metrics.map((metric, i) => (
                    <span key={i} className="metric-badge">
                      <CheckCircle2 size={13} />
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {exhibit.techStack && (
              <div className="tech-stack-box">
                <h4 className="section-title">MEDIUM & ARCHITECTURE</h4>
                <div className="tech-tags">
                  {exhibit.techStack.map((tech, i) => (
                    <span key={i} className="tech-badge">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Skills if Artifact */}
            {exhibit.skills && (
              <div className="tech-stack-box">
                <h4 className="section-title">CORE PROFICIENCIES</h4>
                <div className="tech-tags">
                  {exhibit.skills.map((skill, i) => (
                    <span key={i} className="tech-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="modal-actions-deck">
              {exhibit.demoUrl && (
                <a
                  href={exhibit.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-btn primary"
                >
                  <ExternalLink size={16} />
                  <span>EXPERIENCE DEMO</span>
                </a>
              )}
              {exhibit.repoUrl && (
                <a
                  href={exhibit.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-btn secondary"
                >
                  <GithubIcon size={16} />
                  <span>INSPECT SOURCE</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
