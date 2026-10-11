import { useState } from 'react'
import { X, Copy, Check, Send, Mail, Globe, Sparkles } from 'lucide-react'
import { CURATOR_CONTACT } from '../data/museumData'

function GithubIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  )
}

export default function GuestbookModal({ onClose }) {
  const [copied, setCopied] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guestNote, setGuestNote] = useState('')
  const [inscribed, setInscribed] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CURATOR_CONTACT.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!guestName.trim() || !guestNote.trim()) return
    setInscribed(true)
  }

  return (
    <div className="guestbook-modal-overlay" role="dialog" aria-modal="true">
      <div className="guestbook-modal-card">
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close Curator Salon"
        >
          <X size={20} />
          <span>ESC</span>
        </button>

        <div className="guestbook-grid">
          {/* Left Column: Curator Contacts & Dossier */}
          <div className="salon-info-pane">
            <div className="salon-badge">
              <Sparkles size={14} />
              <span>THE CURATOR'S SALON</span>
            </div>

            <h2 className="salon-title">{CURATOR_CONTACT.curatorName}</h2>
            <p className="salon-subtitle">{CURATOR_CONTACT.role}</p>

            <div className="status-item">
              <div className="pulse-green" />
              <span>{CURATOR_CONTACT.availability}</span>
            </div>

            <div className="contact-channels">
              {/* Email with 1-click Copy */}
              <div className="channel-box">
                <div className="channel-meta">
                  <Mail size={16} />
                  <span>DIRECT INQUIRIES</span>
                </div>
                <div className="copy-action-row">
                  <span className="email-text">{CURATOR_CONTACT.email}</span>
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={handleCopyEmail}
                    title="Copy Email to Clipboard"
                  >
                    {copied ? <Check size={14} className="green-icon" /> : <Copy size={14} />}
                    <span>{copied ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </div>

              {/* GitHub Repository */}
              <div className="channel-box">
                <div className="channel-meta">
                  <GithubIcon size={16} />
                  <span>REPOSITORY ARCHIVE</span>
                </div>
                <a
                  href={CURATOR_CONTACT.portfolioRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-row"
                >
                  <span>github.com/MitraZahiri/Portfolio</span>
                  <Globe size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Museum Guestbook Form */}
          <div className="guestbook-form-pane">
            <h3 className="pane-title">INSCRIBE THE GUESTBOOK</h3>
            <p className="pane-desc">
              Leave your thoughts, project inquiries, or greetings in the permanent museum visitor ledger.
            </p>

            {inscribed ? (
              <div className="inscription-success">
                <div className="seal-check">
                  <Check size={28} />
                </div>
                <h4>Inscription Recorded</h4>
                <p>
                  Thank you, <strong>{guestName}</strong>. Your message has been inscribed into the curator's journal. We look forward to connecting.
                </p>
                <button
                  type="button"
                  className="inscribe-again-btn"
                  onClick={() => {
                    setInscribed(false)
                    setGuestName('')
                    setGuestNote('')
                  }}
                >
                  Inscribe Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="guestbook-form">
                <div className="form-group">
                  <label htmlFor="guest-name">Your Name / Organization</label>
                  <input
                    id="guest-name"
                    type="text"
                    required
                    placeholder="e.g. Leonardo da Vinci / Studio Neo"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="guest-note">Your Inscription or Proposal</label>
                  <textarea
                    id="guest-note"
                    required
                    rows={4}
                    placeholder="Write your reflection on the exhibition, collaborative thoughts, or design challenge..."
                    value={guestNote}
                    onChange={(e) => setGuestNote(e.target.value)}
                  />
                </div>

                <button type="submit" className="submit-inscription-btn">
                  <Send size={15} />
                  <span>SEAL & INSCRIBE</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
