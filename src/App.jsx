import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FaLinkedin, FaEnvelope } from 'react-icons/fa'

function scrollToId(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// reveal on scroll
function useReveal() {
  useEffect(() => {
    const elms = document.querySelectorAll('[data-reveal]')
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('reveal-in')
          io.unobserve(e.target)
        }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 })
    elms.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function Section({ id, children, className='' }) {
  return (
    <section id={id} className={`min-h-screen w-full px-6 md:px-10 lg:px-16 py-20 ${className}`} data-reveal>
      {children}
    </section>
  )
}

function Navbar({ active }) {
  const LinkBtn = ({ id, label }) => (
    <button onClick={() => scrollToId(id)} className={`hover:text-white transition-colors ${active===id ? 'text-white' : 'text-white/80'}`}>
      {label}
    </button>
  )
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40 border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <button onClick={() => scrollToId('home')} className="text-white hover:opacity-90 font-semibold tracking-wide">
          SS · Portfolio
        </button>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <LinkBtn id="about" label="About" />
          <LinkBtn id="projects" label="Projects" />
          <LinkBtn id="contact" label="Contact" />
          <a href="#contact" onClick={(e)=>{e.preventDefault(); scrollToId('contact')}} className="inline-flex items-center rounded-2xl border border-white/15 bg-white/10 hover:bg-white/15 px-4 py-2 text-white">
            Get in touch
          </a>
        </nav>
      </div>
    </header>
  )
}

function ProjectCard({ title, description, tags, onClick }) {
  return (
    <div onClick={onClick} className="cursor-pointer group rounded-2xl border border-white/10 bg-slate-900/50 hover:bg-slate-900/40 transition-all shadow-xl shadow-emerald-900/10 p-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-semibold text-white/95">{title}</h3>
      </div>
      <p className="mt-2 text-white/70 leading-relaxed">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="text-xs rounded-full border border-teal-300/30 bg-teal-400/10 px-2 py-1 text-teal-100/90">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function BackToTop() {
  const btnRef = useRef(null)
  useEffect(() => {
    const onScroll = () => {
      const show = window.scrollY > window.innerHeight * 0.8
      if (btnRef.current) btnRef.current.style.opacity = show ? '1' : '0'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      ref={btnRef}
      onClick={() => scrollToId('home')}
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 h-12 w-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white/90 backdrop-blur transition-opacity duration-300"
      aria-label="Back to top"
      title="Back to top"
      style={{ opacity: 0 }}
    >
      ↑
    </button>
  )
}

function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-cyan-950/60 to-slate-950" />
      <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(circle at 30% 30%, #38bdf8, transparent 60%)' }} />
      <div className="absolute top-1/4 -right-24 h-96 w-96 rounded-full blur-3xl opacity-25" style={{ background: 'radial-gradient(circle at 60% 40%, #22d3ee, transparent 60%)' }} />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle at 50% 50%, #34d399, transparent 60%)' }} />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:36px_36px]" />
    </div>
  )
}

function ScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100
      setP(pct)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-[60]">
      <div className="h-1 bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-300" style={{ width: `${p}%` }} />
    </div>
  )
}

// simple typewriter effect via CSS
function useTypewriter() {
  useEffect(() => {
    const el = document.querySelector('.typewriter')
    if (!el) return
    el.classList.add('typing')
  }, [])
}

export default function App() {
  useReveal()
  useTypewriter()
  const [active, setActive] = useState('home')
  const sections = useMemo(() => ['home', 'about', 'projects', 'contact'], [])
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a,b)=> b.intersectionRatio - a.intersectionRatio)
      if (vis[0]) setActive(vis[0].target.id)
    }, { threshold: [0.3, 0.6] })
    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [sections])

  const projects = [
    {
      title: 'EcoSphere™ — AR Seafood Sustainability',
      description: 'AR-based platform to visualize environmental impact and enable personalized, lab-grown seafood choices with an EcoScore system.',
      tags: ['Generative AI', 'HCI'],
      link: '#',
    },
    {
      title: 'VR Museum User Simulator',
      description: 'Persona-aware dialogue + gaze simulator using CVAE & T5 for training an LLM-driven museum guide.',
      tags: ['NLP', 'LLMs', 'UX Research'],
      link: '#',
    },
    {
      title: 'SkateSmart',
      description: 'Smart inline skating app concept to help people learn without skateparks.',
      tags: ['Interaction Tech', 'HMI'],
      link: '#',
    },
  ]

  const [filter, setFilter] = useState('ALL')
  const filtered = projects.filter((p) => (filter === 'ALL' ? true : p.tags.includes(filter)))
  const allTags = useMemo(() => Array.from(new Set(projects.flatMap((p) => p.tags))), [])

  const [modal, setModal] = useState(null)

  return (
    <div className="relative min-h-screen text-white">
      <Background />
      <ScrollProgress />
      <Navbar active={active} />

      {/* Hero */}
      <Section id="home" className="flex items-center">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-teal-200/90 tracking-widest uppercase text-sm mb-3">Hi, I am</p>
            <h1 className="typewriter text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight overflow-hidden whitespace-nowrap border-r-2 border-white/60 pr-2">
              Shreya Sanghamitra
            </h1>
            <p className="mt-5 text-white/80 text-lg md:text-xl max-w-prose">
              Interaction Technology Graduate @ UTwente | HMI | Generative AI • <span className="text-sky-300">LLMs</span> • <span className="text-teal-300">NLP</span> • UX Research • HCI
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => scrollToId('about')} className="rounded-2xl px-5 py-3 border border-white/15 bg-white/10 hover:bg-white/15">About me</button>
              <button onClick={() => scrollToId('projects')} className="rounded-2xl px-5 py-3 border border-teal-300/40 bg-teal-500/20 hover:bg-teal-500/25 text-teal-100">View projects</button>
              <button onClick={() => scrollToId('contact')} className="rounded-2xl px-5 py-3 border border-white/15 hover:bg-white/10">Contact</button>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Generative AI','LLMs','NLP','UX Research','HCI','HMI'].map((s) => (
                <span key={s} className="text-sm rounded-full border border-teal-300/30 bg-white/5 px-3 py-1 text-white/80">{s}</span>
              ))}
            </div>
          </div>
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/10 to-slate-900/40">
            {/* Replace the src with your actual image in /public */}
            <img
              src="/profile.png"
              alt="Shreya Sanghamitra"
              className="h-full w-full object-cover"
            />
            <div className="-inset-2 absolute rounded-3xl blur-2xl opacity-20" style={{ background: 'conic-gradient(from 90deg, #38bdf8, #22d3ee, #34d399, #38bdf8)' }} />
          </div>
        </div>
      </Section>

      {/* About */}
      <Section id="about">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">About me</h2>
          <p className="mt-4 text-white/80 leading-relaxed">
            I'm an Interaction Technology graduate student at the University of Twente. My work sits at the intersection of human–computer interaction, NLP, and generative AI,
            focusing on intuitive, adaptive systems aligned with real user needs.
          </p>
        </div>
      </Section>

      {/* Projects */}
      <Section id="projects">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Projects</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            <button onClick={()=>setFilter('ALL')} className={`px-3 py-1 rounded-full border ${filter==='ALL' ? 'bg-teal-500/20 border-teal-300/40 text-teal-100' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'}`}>All</button>
            {allTags.map((t)=>(
              <button key={t} onClick={()=>setFilter(t)} className={`px-3 py-1 rounded-full border ${filter===t ? 'bg-teal-500/20 border-teal-300/40 text-teal-100' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'}`}>{t}</button>
            ))}
          </div>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProjectCard key={p.title} {...p} onClick={()=>setModal(p)} />
            ))}
          </div>
        </div>
      </Section>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-lg w-full relative">
            <button onClick={()=>setModal(null)} className="absolute top-3 right-3 text-white/60 hover:text-white">✕</button>
            <h3 className="text-2xl font-bold text-white mb-4">{modal.title}</h3>
            <p className="text-white/80 mb-4">{modal.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {modal.tags.map((t)=>(<span key={t} className="text-xs rounded-full border border-teal-300/30 bg-teal-400/10 px-2 py-1 text-teal-100/90">{t}</span>))}
            </div>
            {modal.link && <a href={modal.link} className="text-teal-200 underline" target="_blank">Learn more</a>}
          </div>
        </div>
      )}

      {/* Contact */}
      <Section id="contact">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Contact me</h2>
          <p className="mt-3 text-white/80">Reach me by form or via LinkedIn/email.</p>

          {/* Icon buttons */}
          <div className="mt-4 flex gap-3">
            <a href="https://www.linkedin.com/in/shreya-sanghamitra" target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 px-4 py-2">
              <FaLinkedin aria-hidden /> <span>LinkedIn</span>
            </a>
            <a href="mailto:sanghapraju@yahoo.com" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 px-4 py-2">
              <FaEnvelope aria-hidden /> <span>Email</span>
            </a>
          </div>

          <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" className="mt-8 space-y-4">
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden">
              <label>Don’t fill this out: <input name="bot-field" /></label>
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/80">Name</label>
                <input name="name" required className="mt-1 w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-teal-400/60" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm text-white/80">Email</label>
                <input type="email" name="email" required className="mt-1 w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-teal-400/60" placeholder="your_email@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/80">Message</label>
              <textarea name="message" required rows="6" className="mt-1 w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 outline-none focus:border-teal-400/60" placeholder="Type your message here…" />
            </div>
            <div className="pt-2 flex items-center gap-3">
              <button type="submit" className="rounded-2xl px-6 py-3 border border-teal-300/40 bg-teal-500/20 hover:bg-teal-500/25 text-teal-100">Send message</button>
              <button type="button" onClick={() => scrollToId('home')} className="rounded-2xl px-6 py-3 border border-white/15 hover:bg-white/10">Back to top</button>
            </div>
          </form>
        </div>
      </Section>

      <footer className="px-6 md:px-10 lg:px-16 py-10 border-t border-white/10 text-white/60">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Shreya Sanghamitra</p>
          <div className="flex items-center gap-3">
            <a href="https://www.linkedin.com/in/shreya-sanghamitra" target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 px-3 py-2">
              <FaLinkedin aria-hidden /> <span className="hidden sm:inline">LinkedIn</span>
            </a>
            <a href="mailto:sanghapraju@yahoo.com" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 px-3 py-2">
              <FaEnvelope aria-hidden /> <span className="hidden sm:inline">Email</span>
            </a>
          </div>
        </div>
      </footer>

      <BackToTop />

      {/* tiny CSS for typewriter + reveal */}
      <style>{`
        [data-reveal] { opacity: 0; transform: translateY(12px); transition: opacity .6s ease, transform .6s ease; }
        .reveal-in { opacity: 1 !important; transform: translateY(0) !important; }
        .typewriter.typing { animation: caret 1s step-end infinite; }
        @keyframes caret { 50% { border-color: transparent; } }
      `}</style>
    </div>
  )
}
