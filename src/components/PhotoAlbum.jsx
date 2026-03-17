import { useState, useRef, useEffect } from 'react'
import { pictureFilenames } from '../pictureList'
import './PhotoAlbum.css'

const IMAGES_PER_SIDE = 3
const IMAGE_BASE = `${import.meta.env.BASE_URL}pictures`

function PhotoAlbum({ title, photoPlaceholder, clickToOpen = 'Click to open', closeBookLabel = 'Close book' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentSpread, setCurrentSpread] = useState(0)
  const [flipAngle, setFlipAngle] = useState(0)
  const [flipDirection, setFlipDirection] = useState(null)
  const [noTransition, setNoTransition] = useState(false)
  const [justOpened, setJustOpened] = useState(false)
  const [playingCloseOpen, setPlayingCloseOpen] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState(null)
  const [showCloseBtn, setShowCloseBtn] = useState(false)
  const flipRef = useRef(null)
  const closeBtnTimerRef = useRef(null)

  const imageUrls = pictureFilenames.map((name) => `${IMAGE_BASE}/${encodeURIComponent(name)}`)
  const spreads = []
  for (let i = 0; i < imageUrls.length; i += IMAGES_PER_SIDE * 2) {
    spreads.push({
      left: imageUrls.slice(i, i + IMAGES_PER_SIDE),
      right: imageUrls.slice(i + IMAGES_PER_SIDE, i + IMAGES_PER_SIDE * 2),
    })
  }
  if (spreads.length === 0) spreads.push({ left: [], right: [] })

  const canPrev = currentSpread > 0
  const canNext = currentSpread < spreads.length - 1
  const isFlipping = flipDirection !== null

  const openBook = () => {
    setIsOpen(true)
    setJustOpened(true)
  }

  useEffect(() => {
    if (!justOpened) return
    const t = setTimeout(() => setJustOpened(false), 800)
    return () => clearTimeout(t)
  }, [justOpened])

  const handleCloseOpenOnLastPictures = () => {
    if (currentSpread !== spreads.length - 1 || isFlipping || playingCloseOpen) return
    setPlayingCloseOpen(true)
  }

  const turnNext = () => {
    if (!canNext || isFlipping) return
    setFlipDirection('next')
    setFlipAngle(-180)
  }

  const turnPrev = () => {
    if (!canPrev || isFlipping) return
    setFlipDirection('prev')
    setFlipAngle(180)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setFlipAngle(0))
    })
  }

  useEffect(() => {
    if (!flipRef.current || !flipDirection) return
    const el = flipRef.current
    const onEnd = () => {
      if (flipDirection === 'next') setCurrentSpread((i) => i + 1)
      else setCurrentSpread((i) => i - 1)
      setNoTransition(true)
      setFlipAngle(0)
      setFlipDirection(null)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setNoTransition(false))
      })
    }
    el.addEventListener('transitionend', onEnd, { once: true })
    return () => el.removeEventListener('transitionend', onEnd)
  }, [flipDirection, flipAngle])

  const isLastSpread = currentSpread === spreads.length - 1

  useEffect(() => {
    if (!isLastSpread) {
      setShowCloseBtn(false)
      if (closeBtnTimerRef.current) {
        clearTimeout(closeBtnTimerRef.current)
        closeBtnTimerRef.current = null
      }
      return
    }
    closeBtnTimerRef.current = setTimeout(() => setShowCloseBtn(true), 2000)
    return () => {
      if (closeBtnTimerRef.current) clearTimeout(closeBtnTimerRef.current)
    }
  }, [isLastSpread])

  const openLightbox = (e, src) => {
    e.stopPropagation()
    if (src) setLightboxSrc(src)
  }

  const renderPage = (urls, side) => (
    <div className={`book-page-side book-page-${side}`}>
      {urls.map((src, i) => (
        <div key={i} className="book-photo-wrap book-photo-clickable" onClick={(e) => openLightbox(e, src)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox(e, src)}>
          <img src={src} alt="" loading="lazy" onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling?.classList.add('show') }} />
          <div className="book-photo-placeholder"><span>📷</span><p>{photoPlaceholder}</p></div>
        </div>
      ))}
      {Array.from({ length: IMAGES_PER_SIDE - urls.length }).map((_, i) => (
        <div key={`e-${i}`} className="book-photo-wrap book-photo-empty">
          <div className="book-photo-placeholder"><span>📷</span><p>{photoPlaceholder}</p></div>
        </div>
      ))}
    </div>
  )

  if (!isOpen) {
    return (
      <div className="book-closed-wrapper">
        <button type="button" className="book-closed" onClick={openBook} aria-label="Open book">
          <div className="book-cover">
            <span className="book-cover-title">{title}</span>
            <span className="book-cover-hint">{clickToOpen}</span>
          </div>
        </button>
      </div>
    )
  }

  const frontSpread = flipDirection === 'prev' ? spreads[currentSpread - 1] : spreads[currentSpread]
  const backSpread = flipDirection === 'prev' ? spreads[currentSpread] : spreads[currentSpread + 1] || spreads[currentSpread]

  return (
    <div className="book-open">
      {isLastSpread && (
        <button type="button" className={`book-close-btn ${showCloseBtn ? 'book-close-btn-visible' : ''}`} onClick={() => setIsOpen(false)} aria-label="Close book">{closeBookLabel}</button>
      )}
      {lightboxSrc && (
        <div className="book-lightbox" onClick={() => setLightboxSrc(null)} role="dialog" aria-modal="true" aria-label="Close">
          <button type="button" className="book-lightbox-close" onClick={() => setLightboxSrc(null)} aria-label="Close">✕</button>
          <img src={lightboxSrc} alt="" className="book-lightbox-img" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      <div className="book-container">
        <button type="button" className="book-nav book-prev" onClick={turnPrev} disabled={!canPrev || isFlipping} aria-label="Previous page" />
        <div className="book-spread-wrap">
          <div className="book-spread-inner">
          <div className={`book-flip ${noTransition ? 'book-flip-no-transition' : ''} ${justOpened ? 'book-flip-opening' : ''} ${playingCloseOpen ? 'book-flip-close-open' : ''}`} ref={flipRef} style={!playingCloseOpen && !justOpened ? { transform: `perspective(1200px) rotateY(${flipAngle}deg)` } : undefined} onAnimationEnd={(e) => { if (e.animationName === 'bookCloseOpen') setPlayingCloseOpen(false) }}>
            <div className="book-flip-front">
              {renderPage(frontSpread.left, 'left')}
              <div className="book-spine" />
              {renderPage(frontSpread.right, 'right')}
            </div>
            <div className="book-flip-back">
              {renderPage(backSpread.left, 'left')}
              <div className="book-spine" />
              {renderPage(backSpread.right, 'right')}
            </div>
          </div>
          {isLastSpread && (
            <button type="button" className="book-last-spread-replay" onClick={handleCloseOpenOnLastPictures} aria-label="Play close and open animation">✨ Replay</button>
          )}
        </div>
        </div>
        <button type="button" className="book-nav book-next" onClick={turnNext} disabled={!canNext || isFlipping} aria-label="Next page" />
      </div>
      <p className="book-page-indicator">{currentSpread + 1} / {spreads.length}</p>
    </div>
  )
}

export default PhotoAlbum
