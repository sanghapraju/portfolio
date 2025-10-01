import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FaLinkedin, FaEnvelope } from 'react-icons/fa'

function scrollToId(id) { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

function useReveal() {
  useEffect(() => {
    const elms = document.querySelectorAll('[data-reveal]')
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add('reveal-in'); io.unobserve(e.target) }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 })
    elms.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function Section({ id, children, className='' }) {
  return <section id={id} className={`min-h-screen w-full px-6 md:px-10 lg:px-16 py-20 ${className}`} data-reveal>{children}</section>
}

function Navbar({ active }) {
  const LinkBtn = ({ id, label }) => (
    <button onClick={() => scrollToId(id)} className={`hover:text-white transition-colors ${active===id ? 'text-white' : 'text-white/80'}`}>{label}</button>
  )
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40 border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <button onClick={() => scrollToId('home')} className="text-white hover:opacity-90 font-semibold tracking-wide">SS · Portfolio</button>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <LinkBtn id="about" label="About" />
          <LinkBtn id="projects" label="Projects" />
          <LinkBtn id="contact" label="Contact" />
          <a href="#contact" onClick={(e)=>{e.preventDefault(); scrollToId('contact')}} className="inline-flex items-center rounded-2xl border border-white/15 bg-white/10 hover:bg-white/15 px-4 py-2 text-white">Get in touch</a>
        </nav>
      </div>
    </header>
  )
}

function ProjectCard({ title, description, tags, onClick }) {
  return (
    <div onClick={onClick} className="cursor-pointer group rounded-2xl border border-white/10 bg-slate-900/50 hover:bg-slate-900/40 transition-all shadow-xl shadow-emerald-900/10 p-5">
      <div className="flex items-start justify-between gap-4"><h3 className="text-xl font-semibold text-white/95">{title}</h3></div>
      <p className="mt-2 text-white/70 leading-relaxed">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">{tags.map((t) => (<span key={t} className="text-xs rounded-full border border-teal-300/30 bg-teal-400/10 px-2 py-1 text-teal-100/90">{t}</span>))}</div>
    </div>
  )
}

function BackToTop() {
  const btnRef = useRef(null)
  useEffect(() => {
    const onScroll = () => { const show = window.scrollY > window.innerHeight * 0.8; if (btnRef.current) btnRef.current.style.opacity = show ? '1' : '0' }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (<button ref={btnRef} onClick={() => scrollToId('home')} className="fixed bottom-6 right-6 md:bottom-8 md:right-8 h-12 w-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white/90 backdrop-blur transition-opacity duration-300" aria-label="Back to top" title="Back to top" style={{ opacity: 0 }}>↑</button>)
}

function Aurora() { return (<><div className="aurora-layer aurora-a" /><div className="aurora-layer aurora-b" /><div className="aurora-layer aurora-c" /></>) }

function useHeroTypewriter() {
  useEffect(() => {
    const el = document.getElementById('hero-name'); if (!el) return;
    const text = 'Shreya Sanghamitra'; const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) { el.textContent = text; return }
    let i = 0; const timer = setInterval(()=>{ el.textContent = text.slice(0, ++i); if (i >= text.length) clearInterval(timer) }, 45)
    return () => clearInterval(timer)
  }, [])
}

function useMessagePlaceholder() {
  useEffect(() => {
    const el = document.getElementById('messageBox'); if (!el) return;
    const full = 'Type your message here…'; let i = 0, timer;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = () => { if (prefersReduced) { el.setAttribute('placeholder', full); return }
      timer = setInterval(()=>{ el.setAttribute('placeholder', full.slice(0, ++i)); if (i >= full.length) clearInterval(timer) }, 45) }
    const stop = () => { if (timer) clearInterval(timer) }
    const io = new IntersectionObserver((entries)=>{ if (entries.some(e=>e.isIntersecting)) { start(); io.disconnect() } }, { threshold: 0.4 })
    io.observe(el); el.addEventListener('focus', stop); el.addEventListener('input', stop)
    return () => { stop(); el.removeEventListener('focus', stop); el.removeEventListener('input', stop) }
  }, [])
}

export default function App() {
  useReveal(); useHeroTypewriter(); useMessagePlaceholder();
  const [active, setActive] = useState('home')
  const [tadaFired, setTadaFired] = useState({})
  const sections = useMemo(() => ['home', 'about', 'projects', 'contact'], [])
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a,b)=> b.intersectionRatio - a.intersectionRatio)
      if (vis[0]) { const id = vis[0].target.id; setActive(id); setTadaFired(prev => prev[id] ? prev : { ...prev, [id]: true }) }
    }, { threshold: [0.3, 0.6] })
    sections.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [sections])

  const projects = [
    { title: 'EcoSphere™ — AR Seafood Sustainability', description: 'AR-based platform to visualize environmental impact and enable personalized, lab-grown seafood choices with an EcoScore system.', tags: ['Generative AI','HCI'], link:'#' },
    { title: 'VR Museum User Simulator', description: 'Persona-aware dialogue + gaze simulator using CVAE & T5 for training an LLM-driven museum guide.', tags: ['NLP','LLMs','UX Research'], link:'#' },
    { title: 'SkateSmart', description: 'Smart inline skating app concept to help people learn without skateparks.', tags: ['Interaction Tech','HMI'], link:'#' },
  ]

  const [filter, setFilter] = useState('ALL')
  const filtered = projects.filter((p) => (filter === 'ALL' ? true : p.tags.includes(filter)))
  const allTags = React.useMemo(() => Array.from(new Set(projects.flatMap((p) => p.tags))), [])

  const [modal, setModal] = useState(null)

  const magnetic = (e) => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; if (prefersReduced) return
    const r = e.currentTarget.getBoundingClientRect(); const dx = ((e.clientX - r.left)/r.width - 0.5) * 10; const dy = ((e.clientY - r.top)/r.height - 0.5) * 10
    e.currentTarget.style.transform = `translate(${dx}px, ${dy}px)`
  }
  const unmagnet = (e) => { e.currentTarget.style.transform = '' }

  const parallaxMove = (e) => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; if (prefersReduced) return
    const r = e.currentTarget.getBoundingClientRect(); const x = ((e.clientX - r.left)/r.width - 0.5) * 6; const y = ((e.clientY - r.top)/r.height - 0.5) * -6
    e.currentTarget.style.transform = `perspective(800px) rotateY(${x/2}deg) rotateX(${y/2}deg)`
  }
  const parallaxLeave = (e) => { e.currentTarget.style.transform = 'none' }

  return (
    <div className="relative min-h-screen text-white">
      <div className="fixed inset-0 -z-10 pointer-events-none"><Aurora /></div>
      <Navbar active={active} />

      <Section id="home" className="flex items-center">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-teal-200/90 tracking-widest uppercase text-sm mb-3">Hi, I am</p>
            <h1 id="hero-name" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight" />
            <p className="mt-5 text-white/80 text-lg md:text-xl max-w-prose">
              Interaction Technology Graduate @ UTwente | HMI | Generative AI • <span className="text-sky-300">LLMs</span> • <span className="text-teal-300">NLP</span> • UX Research • HCI
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onMouseMove={magnetic} onMouseLeave={unmagnet} onClick={() => scrollToId('about')} className="rounded-2xl px-5 py-3 border border-white/15 bg-white/10 hover:bg-white/15">About me</button>
              <button onMouseMove={magnetic} onMouseLeave={unmagnet} onClick={() => scrollToId('projects')} className="rounded-2xl px-5 py-3 border border-teal-300/40 bg-teal-500/20 hover:bg-teal-500/25 text-teal-100">View projects</button>
              <button onMouseMove={magnetic} onMouseLeave={unmagnet} onClick={() => scrollToId('contact')} className="rounded-2xl px-5 py-3 border border-white/15 hover:bg-white/10">Contact</button>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Generative AI','LLMs','NLP','UX Research','HCI','HMI'].map((s) => (<span key={s} className="text-sm rounded-full border border-teal-300/30 bg-white/5 px-3 py-1 text-white/80">{s}</span>))}
            </div>
          </div>

          <div className={`relative h-64 sm:h-80 md:h-96 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/10 to-slate-900/40 transition-transform duration-700 will-change-transform ${active === 'home' ? 'rotate-[0.8deg]' : 'rotate-0'} ${tadaFired['home'] ? 'tada-lines' : ''}`} onMouseMove={parallaxMove} onMouseLeave={parallaxLeave}>
            <img src="/profile.png" alt="Shreya Sanghamitra" className="h-full w-full object-cover" />
            <div className="-inset-2 absolute rounded-3xl blur-2xl opacity-20" style={{ background: 'conic-gradient(from 90deg, #38bdf8, #22d3ee, #34d399, #38bdf8)' }} />
          </div>
        </div>
      </Section>

      <Section id="about">
        <div className="max-w-4xl mx-auto">
          <h2 className={`relative text-3xl md:text-4xl font-bold transition-transform duration-500 ${active === 'about' ? 'rotate-[-0.5deg]' : 'rotate-0'} ${tadaFired['about'] ? 'tada-lines' : ''}`}>About me</h2>
          <p className="mt-4 text-white/80 leading-relaxed">I'm an Interaction Technology graduate student at the University of Twente. My work sits at the intersection of human–computer interaction, NLP, and generative AI, focusing on intuitive, adaptive systems aligned with real user needs.</p>
        </div>
      </Section>

      <Section id="projects">
        <div className="max-w-6xl mx-auto">
          <h2 className={`relative text-3xl md:text-4xl font-bold transition-transform duration-500 ${active === 'projects' ? 'rotate-[-0.5deg]' : 'rotate-0'} ${tadaFired['projects'] ? 'tada-lines' : ''}`}>Projects</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            <button onClick={()=>setFilter('ALL')} className={`px-3 py-1 rounded-full border ${filter==='ALL' ? 'bg-teal-500/20 border-teal-300/40 text-teal-100' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'}`}>All</button>
            {allTags.map((t)=>(<button key={t} onClick={()=>setFilter(t)} className={`px-3 py-1 rounded-full border ${filter===t ? 'bg-teal-500/20 border-teal-300/40 text-teal-100' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'}`}>{t}</button>))}
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (<ProjectCard key={p.title} {...p} onClick={()=>setModal(p)} />))}
          </div>
        </div>
      </Section>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-lg w-full relative">
            <button onClick={()=>setModal(null)} className="absolute top-3 right-3 text-white/60 hover:text-white">✕</button>
            <h3 className="text-2xl font-bold text-white mb-4">{modal.title}</h3>
            <p className="text-white/80 mb-4">{modal.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">{modal.tags.map((t)=>(<span key={t} className="text-xs rounded-full border border-teal-300/30 bg-teal-400/10 px-2 py-1 text-teal-100/90">{t}</span>))}</div>
            {modal.link && <a href={modal.link} className="text-teal-200 underline" target="_blank">Learn more</a>}
          </div>
        </div>
      )}

      <Section id="contact">
        <div className="max-w-3xl mx-auto">
          <h2 className={`relative text-3xl md:text-4xl font-bold transition-transform duration-500 ${active === 'contact' ? 'rotate-[-0.5deg]' : 'rotate-0'} ${tadaFired['contact'] ? 'tada-lines' : ''}`}>Contact me</h2>
          <p className="mt-3 text-white/80">Reach me by form or via LinkedIn/email.</p>
          <div className="mt-4 flex gap-3">
            <a href="https://www.linkedin.com/in/shreya-sanghamitra" target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 px-4 py-2"><span className="sr-only">LinkedIn</span><FaLinkedin aria-hidden /><span>LinkedIn</span></a>
            <a href="mailto:sanghapraju@yahoo.com" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 px-4 py-2"><span className="sr-only">Email</span><FaEnvelope aria-hidden /><span>Email</span></a>
          </div>
          <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" className="mt-8 space-y-4">
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden"><label>Don’t fill this out: <input name="bot-field" /></label></p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-sm text-white/80">Name</label><input name="name" required className="mt-1 w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-teal-400/60" placeholder="Your name" /></div>
              <div><label className="block text-sm text-white/80">Email</label><input type="email" name="email" required className="mt-1 w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-teal-400/60" placeholder="you@example.com" /></div>
            </div>
            <div><label className="block text-sm text-white/80">Message</label><textarea id="messageBox" name="message" required rows="6" className="mt-1 w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-teal-400/60" placeholder="Type your message here…" /></div>
            <div className="pt-2 flex items-center gap-3">
              <button onMouseMove={magnetic} onMouseLeave={unmagnet} type="submit" className="rounded-2xl px-6 py-3 border border-teal-300/40 bg-teal-500/20 hover:bg-teal-500/25 text-teal-100">Send message</button>
              <button onMouseMove={magnetic} onMouseLeave={unmagnet} type="button" onClick={() => scrollToId('home')} className="rounded-2xl px-6 py-3 border border-white/15 hover:bg-white/10">Back to top</button>
            </div>
          </form>
        </div>
      </Section>

      <footer className="px-6 md:px-10 lg:px-16 py-10 border-t border-white/10 text-white/60">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Shreya Sanghamitra</p>
          <div className="flex items-center gap-3">
            <a href="https://www.linkedin.com/in/shreya-sanghamitra" target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 px-3 py-2"><FaLinkedin aria-hidden /> <span className="hidden sm:inline">LinkedIn</span></a>
            <a href="mailto:sanghapraju@yahoo.com" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 px-3 py-2"><FaEnvelope aria-hidden /> <span className="hidden sm:inline">Email</span></a>
          </div>
        </div>
      </footer>

      {/* Styles for reveal + ta-da + aurora */}
      <style>{`
        [data-reveal] { opacity: 0; transform: translateY(12px); transition: opacity .6s ease, transform .6s ease; }
        .reveal-in { opacity: 1 !important; transform: translateY(0) !important; }
        .tada-lines::after { content: ""; position: absolute; inset: -10px; background: repeating-linear-gradient(90deg, rgba(255,255,255,0.45), rgba(255,255,255,0.45) 2px, transparent 2px, transparent 8px); mask-image: radial-gradient(circle at 50% 50%, white 28%, transparent 70%); opacity: 0; transform: scale(0.9); pointer-events: none; animation: tada-lines 620ms ease-out forwards; }
        @keyframes tada-lines { 0% { opacity: 0; transform: scale(0.6); } 40% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(1.18); } }
        .aurora-layer { position: fixed; inset: -10%; filter: blur(18px) saturate(110%); opacity: .22; }
        .aurora-a { background: radial-gradient(120% 80% at 10% 20%, rgba(56,189,248,0.25), transparent 60%); animation: aurora-pan-a 100s linear infinite alternate; }
        .aurora-b { background: radial-gradient(120% 80% at 85% 30%, rgba(34,211,238,0.20), transparent 60%); animation: aurora-pan-b 120s ease-in-out infinite alternate; }
        .aurora-c { background: radial-gradient(120% 90% at 40% 85%, rgba(52,211,153,0.18), transparent 60%); animation: aurora-pan-c 140s ease-in-out infinite alternate; }
        @keyframes aurora-pan-a { 0% { transform: translate3d(-2%, -1%, 0) scale(1.02); } 100% { transform: translate3d(2%, 1%, 0) scale(1.03); } }
        @keyframes aurora-pan-b { 0% { transform: translate3d(1%, -2%, 0) scale(1.02); } 100% { transform: translate3d(-1%, 2%, 0) scale(1.03); } }
        @keyframes aurora-pan-c { 0% { transform: translate3d(-1%, 1%, 0) scale(1.01); } 100% { transform: translate3d(1%, -1%, 0) scale(1.02); } }
        @media (prefers-reduced-motion: reduce) { .aurora-layer { animation: none !important; } }
      `}</style>
    </div>
  )
}
