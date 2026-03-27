import { useState } from 'react'
import { motion } from 'motion/react'
import { translations } from './translations'
import PhotoAlbum from './components/PhotoAlbum'
import Sparkles from './components/Sparkles'
import CursorAttractor from './components/CursorAttractor'
import PullSwitch3D from './components/PullSwitch3D'
import './App.css'

const projectorVideos = ["val'swish.mp4", "nat's wish.mp4"]

function App() {
  const [lang, setLang] = useState('en')
  const [projectorMode, setProjectorMode] = useState(false)
  const [projectorVideoIndex, setProjectorVideoIndex] = useState(0)
  const t = translations[lang]
  const activeVideo = `${import.meta.env.BASE_URL}videos/${encodeURIComponent(projectorVideos[projectorVideoIndex])}`

  return (
    <div className={`app ${projectorMode ? 'lights-off' : ''}`}>
      <CursorAttractor className="cursor-attractor-bg" />
      <Sparkles />
      {!projectorMode && <PullSwitch3D onPulled={() => setProjectorMode(true)} />}
      <header className="header">
        <button
          className="lang-toggle"
          onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
          aria-label="Toggle language"
        >
          <span className={lang === 'es' ? 'active' : ''}>ES</span>
          <span className="sep">|</span>
          <span className={lang === 'en' ? 'active' : ''}>EN</span>
        </button>
      </header>

      <section className="hero">
        <motion.p className="hero-label" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>{t.title}</motion.p>
        <motion.h1 className="hero-name" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>{t.name}</motion.h1>
        <motion.p className="hero-subtitle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>{t.subtitle}</motion.p>
      </section>

      <section className="photobook-section">
        <h2 className="photobook-title">{t.photobookTitle}</h2>
        <PhotoAlbum title={t.photobookTitle} photoPlaceholder={t.photoPlaceholder} clickToOpen={t.clickToOpen} closeBookLabel={t.closeBook} />
      </section>

      <footer className="footer">
        <p>♥ {new Date().getFullYear()}</p>
      </footer>

      {projectorMode && (
        <div className="projector-mode">
          <div className="projector-stage">
            <img
              src={`${import.meta.env.BASE_URL}pictures/projector.jpg`}
              alt="Projector"
              className="projector-image"
            />
            <div className="projector-screen">
              <video
                key={activeVideo}
                className="projector-video"
                src={activeVideo}
                controls
                autoPlay
                playsInline
              />
              <button
                type="button"
                className="projector-nav projector-prev"
                onClick={() => setProjectorVideoIndex((i) => (i - 1 + projectorVideos.length) % projectorVideos.length)}
                aria-label="Previous video"
              >
                Prev
              </button>
              <button
                type="button"
                className="projector-nav projector-next"
                onClick={() => setProjectorVideoIndex((i) => (i + 1) % projectorVideos.length)}
                aria-label="Next video"
              >
                Next
              </button>
            </div>
          </div>
          <button className="projector-close" onClick={() => setProjectorMode(false)}>
            Turn lights on
          </button>
        </div>
      )}
    </div>
  )
}

export default App
