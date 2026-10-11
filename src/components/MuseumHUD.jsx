import { useState, useEffect, useRef } from 'react'
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Compass,
  Mail,
} from 'lucide-react'
import { MUSEUM_ROOMS } from '../data/museumData'
import { audioEngine } from '../utils/audioEngine'

export default function MuseumHUD({
  activeRoom,
  scrollProgress,
  onJumpToRoom,
  autoTour,
  onToggleAutoTour,
  soundEnabled,
  onToggleSound,
  onOpenGuestbook,
  onToggleMiniMap,
  isMiniMapOpen,
}) {
  const [visualizerBars, setVisualizerBars] = useState([8, 12, 16, 20, 14, 10])
  const animFrameRef = useRef(null)

  // Real-time Audio Visualizer Loop
  useEffect(() => {
    const updateVisualizer = () => {
      if (soundEnabled) {
        const freq = audioEngine.getFrequencyData()
        if (freq && freq.length >= 6) {
          const bars = [
            Math.max(6, Math.min(26, (freq[1] / 255) * 26)),
            Math.max(6, Math.min(28, (freq[3] / 255) * 28)),
            Math.max(6, Math.min(30, (freq[5] / 255) * 30)),
            Math.max(6, Math.min(24, (freq[7] / 255) * 24)),
            Math.max(6, Math.min(20, (freq[9] / 255) * 20)),
            Math.max(6, Math.min(16, (freq[11] / 255) * 16)),
          ]
          setVisualizerBars(bars)
        }
      } else {
        setVisualizerBars([4, 4, 4, 4, 4, 4])
      }
      animFrameRef.current = requestAnimationFrame(updateVisualizer)
    }

    animFrameRef.current = requestAnimationFrame(updateVisualizer)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [soundEnabled])

  // Calculate simulated depth Z in meters
  const currentZMeter = Math.round(10 - scrollProgress * 255)

  return (
    <aside className="museum-hud" aria-label="Museum Navigation and Controls">
      {/* =========================================
          TOP NAVIGATION BAR
         ========================================= */}
      <header className="hud-top-bar">
        {/* Left: Curator Monogram & Title */}
        <div className="curator-brand">
          <div className="monogram">MZ</div>
          <div className="brand-text">
            <span className="curator-name">MITRA ZAHIRI</span>
            <span className="museum-title">THE MUSEUM OF CODE</span>
          </div>
        </div>

        {/* Center: Live Room Telemetry Badge */}
        <div className="room-telemetry">
          <div className="telemetry-pill">
            <span className="live-dot" />
            <span className="hall-code">{activeRoom.hallCode}</span>
            <span className="divider">/</span>
            <span className="room-name">{activeRoom.name.toUpperCase()}</span>
            <span className="z-readout">[{currentZMeter}m]</span>
          </div>
        </div>

        {/* Right: Quick Controls (Sound, MiniMap, Guestbook) */}
        <div className="hud-actions">
          {/* Sound Toggle with Live Equalizer */}
          <button
            type="button"
            className={`hud-btn sound-btn ${soundEnabled ? 'active' : ''}`}
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Museum Audio' : 'Enable Museum Audio'}
            aria-label={soundEnabled ? 'Mute Museum Audio' : 'Enable Museum Audio'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <div className="sound-visualizer">
              {visualizerBars.map((height, i) => (
                <span
                  key={i}
                  className="bar"
                  style={{
                    height: `${height}px`,
                    transition: 'height 0.08s ease',
                  }}
                />
              ))}
            </div>
          </button>

          {/* Mini-Map Radar Toggle */}
          <button
            type="button"
            className={`hud-btn ${isMiniMapOpen ? 'active' : ''}`}
            onClick={onToggleMiniMap}
            title="Toggle Museum Floorplan Blueprint"
            aria-label="Toggle Museum Floorplan Blueprint"
          >
            <Compass size={16} />
            <span className="btn-label">FLOORPLAN</span>
          </button>

          {/* Inquiries / Guestbook button */}
          <button
            type="button"
            className="hud-btn primary"
            onClick={onOpenGuestbook}
            title="Open Curator Inquiries & Guestbook"
            aria-label="Open Curator Inquiries & Guestbook"
          >
            <Mail size={16} />
            <span className="btn-label">INQUIRE</span>
          </button>
        </div>
      </header>

      {/* =========================================
          BOTTOM CONTROL DECK
         ========================================= */}
      <footer className="hud-bottom-bar">
        {/* Left: Auto-Tour Controller */}
        <div className="tour-controller">
          <button
            type="button"
            className={`tour-btn ${autoTour ? 'playing' : ''}`}
            onClick={onToggleAutoTour}
            aria-label={autoTour ? 'Pause Guided Tour' : 'Start Guided Tour'}
          >
            {autoTour ? <Pause size={15} /> : <Play size={15} />}
            <span>{autoTour ? 'PAUSE TOUR' : 'AUTO-TOUR'}</span>
          </button>
        </div>

        {/* Center: Interactive Gallery Rail Stepper */}
        <nav className="halls-stepper" aria-label="Museum Wings Navigation">
          {MUSEUM_ROOMS.map((room) => {
            const isActive = activeRoom.id === room.id
            return (
              <button
                key={room.id}
                type="button"
                className={`step-node ${isActive ? 'active' : ''}`}
                onClick={() => onJumpToRoom(room)}
                title={room.name}
              >
                <span className="node-indicator" />
                <span className="node-label">0{room.index}</span>
                <span className="node-tooltip">{room.name}</span>
              </button>
            )
          })}
        </nav>

        {/* Right: Progress percentage & scroll indicator */}
        <div className="scroll-indicator">
          <span className="progress-number">
            {Math.round(scrollProgress * 100)}%
          </span>
          <span className="scroll-hint">SCROLL TO STROLL</span>
        </div>
      </footer>
    </aside>
  )
}
