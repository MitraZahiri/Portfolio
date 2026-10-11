import { useState, useEffect, useRef, useCallback } from 'react'
import MuseumCanvas from './components/MuseumCanvas'
import MuseumHUD from './components/MuseumHUD'
import MiniMap from './components/MiniMap'
import ArtworkModal from './components/ArtworkModal'
import GuestbookModal from './components/GuestbookModal'
import IntroScreen from './components/IntroScreen'
import { MUSEUM_ROOMS } from './data/museumData'
import { audioEngine } from './utils/audioEngine'
import './index.css'

export default function App() {
  const [hasEntered, setHasEntered] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeRoom, setActiveRoom] = useState(MUSEUM_ROOMS[0])
  const [autoTour, setAutoTour] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [isInspecting, setIsInspecting] = useState(false)
  const [inspectedExhibit, setInspectedExhibit] = useState(null)
  const [isMiniMapOpen, setIsMiniMapOpen] = useState(false)
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false)

  // Touch gesture tracking
  const touchStartYRef = useRef(0)
  const autoTourAnimRef = useRef(null)

  // 1. Enter Museum Handler
  const handleEnterMuseum = () => {
    setHasEntered(true)
    const isAudioOn = audioEngine.toggleSound()
    setSoundEnabled(isAudioOn)
    audioEngine.playTransitionChime(1)
  }

  // 2. Sound Toggle
  const handleToggleSound = () => {
    const isAudioOn = audioEngine.toggleSound()
    setSoundEnabled(isAudioOn)
  }

  // 3. Smooth Wheel Navigation along Museum Rail
  const handleWheel = useCallback(
    (e) => {
      if (isInspecting || isGuestbookOpen) return
      // Turn off auto-tour if user manually scrolls
      if (autoTour) setAutoTour(false)

      const delta = e.deltaY * 0.00045
      setScrollProgress((prev) => {
        const next = Math.max(0, Math.min(1, prev + delta))
        return next
      })
    },
    [isInspecting, isGuestbookOpen, autoTour]
  )

  // 4. Touch Navigation for mobile/tablets
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartYRef.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = useCallback(
    (e) => {
      if (isInspecting || isGuestbookOpen) return
      if (!e.touches || !e.touches[0]) return
      if (autoTour) setAutoTour(false)

      const currentY = e.touches[0].clientY
      const deltaY = (touchStartYRef.current - currentY) * 0.0018
      touchStartYRef.current = currentY

      setScrollProgress((prev) => Math.max(0, Math.min(1, prev + deltaY)))
    },
    [isInspecting, isGuestbookOpen, autoTour]
  )

  // 5. Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isInspecting || isGuestbookOpen) return

      if (e.key === 'ArrowDown' || e.key === 'KeyS' || e.key === 'PageDown') {
        setScrollProgress((prev) => Math.min(1, prev + 0.035))
        if (autoTour) setAutoTour(false)
      } else if (e.key === 'ArrowUp' || e.key === 'KeyW' || e.key === 'PageUp') {
        setScrollProgress((prev) => Math.max(0, prev - 0.035))
        if (autoTour) setAutoTour(false)
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        setAutoTour((prev) => !prev)
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleSound()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isInspecting, isGuestbookOpen, autoTour])

  // Attach wheel and touch event listeners
  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [handleWheel, handleTouchMove])

  // 6. Auto-Tour Playback Loop
  useEffect(() => {
    if (autoTour && !isInspecting) {
      const stepTour = () => {
        setScrollProgress((prev) => {
          if (prev >= 1) {
            setAutoTour(false)
            return 1
          }
          return prev + 0.00035
        })
        autoTourAnimRef.current = requestAnimationFrame(stepTour)
      }
      autoTourAnimRef.current = requestAnimationFrame(stepTour)
    } else {
      cancelAnimationFrame(autoTourAnimRef.current)
    }

    return () => cancelAnimationFrame(autoTourAnimRef.current)
  }, [autoTour, isInspecting])

  // 7. Jump to specific room from HUD or Mini-Map
  const handleJumpToRoom = (room) => {
    // Map room index (1 to 6) to approximate scrollProgress (0 to 1)
    const roomProgressMap = {
      rotunda: 0.0,
      masterpieces: 0.21,
      artifacts: 0.41,
      chronicles: 0.61,
      ethos: 0.79,
      salon: 0.98,
    }
    const target = roomProgressMap[room.id] ?? 0
    setScrollProgress(target)
    setActiveRoom(room)
    audioEngine.playTransitionChime(room.index)
  }

  // 8. Exhibit selection (inspection modal)
  const handleExhibitSelect = (data) => {
    setInspectedExhibit(data)
    setIsInspecting(true)
    if (autoTour) setAutoTour(false)
  }

  const handleCloseInspect = () => {
    setIsInspecting(false)
    setInspectedExhibit(null)
  }

  return (
    <div className="museum-experience-root">
      {/* 3D WebGL Canvas Layer */}
      <MuseumCanvas
        scrollProgress={scrollProgress}
        onRoomChange={setActiveRoom}
        onExhibitSelect={handleExhibitSelect}
        isInspecting={isInspecting}
        inspectedExhibit={inspectedExhibit}
        onCloseInspect={handleCloseInspect}
        autoTour={autoTour}
      />

      {/* Intro Screen Overlay (Shows on initial load) */}
      {!hasEntered && <IntroScreen onEnter={handleEnterMuseum} />}

      {/* Immersive HUD Overlay */}
      {hasEntered && (
        <MuseumHUD
          activeRoom={activeRoom}
          scrollProgress={scrollProgress}
          onJumpToRoom={handleJumpToRoom}
          autoTour={autoTour}
          onToggleAutoTour={() => setAutoTour((prev) => !prev)}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenGuestbook={() => setIsGuestbookOpen(true)}
          onToggleMiniMap={() => setIsMiniMapOpen((prev) => !prev)}
          isMiniMapOpen={isMiniMapOpen}
        />
      )}

      {/* Mini-Map Floorplan Radar Modal */}
      {isMiniMapOpen && (
        <MiniMap
          activeRoom={activeRoom}
          scrollProgress={scrollProgress}
          onJumpToRoom={handleJumpToRoom}
          onClose={() => setIsMiniMapOpen(false)}
        />
      )}

      {/* Artwork Inspection Modal */}
      {isInspecting && (
        <ArtworkModal
          exhibit={inspectedExhibit}
          onClose={handleCloseInspect}
        />
      )}

      {/* Curator Guestbook & Inquiries Salon Modal */}
      {isGuestbookOpen && (
        <GuestbookModal onClose={() => setIsGuestbookOpen(false)} />
      )}
    </div>
  )
}
