import { useState } from 'react'
import { motion } from 'motion/react'
import { translations } from './translations'
import PhotoAlbum from './components/PhotoAlbum'
import Sparkles from './components/Sparkles'
import CursorAttractor from './components/CursorAttractor'
import './App.css'

function App() {
  const [lang, setLang] = useState('en')
  const t = translations[lang]

  return (
    <div className="app">
      <CursorAttractor className="cursor-attractor-bg" />
      <Sparkles />
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
    </div>
  )
}

export default App
