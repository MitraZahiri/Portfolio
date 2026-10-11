import { X, Navigation } from 'lucide-react'
import { MUSEUM_ROOMS } from '../data/museumData'

export default function MiniMap({
  activeRoom,
  scrollProgress,
  onJumpToRoom,
  onClose,
}) {
  // Visitor's vertical position on blueprint (0% at top -> 100% at bottom)
  const visitorYPercent = Math.min(100, Math.max(0, scrollProgress * 100))

  return (
    <div className="minimap-modal" role="dialog" aria-label="Museum Architectural Floorplan">
      <div className="minimap-card">
        {/* Blueprint Header */}
        <div className="blueprint-header">
          <div className="blueprint-title-group">
            <Navigation size={16} className="blueprint-icon" />
            <div>
              <h3 className="blueprint-title">MUSEUM BLUEPRINT // RADAR</h3>
              <p className="blueprint-subtitle">Scale 1:200 • Spatial Telemetry</p>
            </div>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close Floorplan"
          >
            <X size={18} />
          </button>
        </div>

        {/* Blueprint Floorplan Canvas */}
        <div className="blueprint-canvas">
          {/* Architectural Blueprint Grid */}
          <div className="blueprint-grid-lines" />

          {/* Compass Rose */}
          <div className="compass-rose">
            <span>N</span>
            <div className="needle" />
          </div>

          {/* Halls Pipeline */}
          <div className="halls-layout">
            {MUSEUM_ROOMS.map((room) => {
              const isActive = activeRoom.id === room.id
              return (
                <button
                  key={room.id}
                  type="button"
                  className={`hall-block ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onJumpToRoom(room)
                    onClose()
                  }}
                >
                  <div className="hall-header">
                    <span className="hall-num">WING 0{room.index}</span>
                    <span className="hall-title">{room.name}</span>
                  </div>
                  <div className="hall-specs">
                    <span>{room.subtitle}</span>
                    {isActive && <span className="current-badge">YOU ARE HERE</span>}
                  </div>
                </button>
              )
            })}

            {/* Dynamic Visitor Tracker Beacon */}
            <div
              className="visitor-beacon"
              style={{ top: `${visitorYPercent}%` }}
              title="Your Current Location"
            >
              <div className="beacon-ping" />
              <div className="beacon-dot" />
              <div className="beacon-label">VISITOR</div>
            </div>
          </div>
        </div>

        {/* Blueprint Footer */}
        <div className="blueprint-footer">
          <span>Click any gallery hall to teleport directly</span>
          <span className="legend-tag">Z-AXIS RAIL NAVIGATION</span>
        </div>
      </div>
    </div>
  )
}
