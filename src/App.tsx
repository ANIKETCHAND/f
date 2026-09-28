import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { HyperText } from '@/components/ui/hyper-text'
import { TextReveal } from '@/components/ui/cascade-text'
import { AIChatbox } from '@/components/AIChatbox'
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Film,
  Heart,
  ImagePlus,
  Grid3X3,
  Menu,
  Play,
  Plus,
  Sparkles,
  Star,
  Trophy,
  X,
} from 'lucide-react'

type Memory = {
  id: number
  type: 'photo' | 'video'
  title: string
  caption: string
  date: string
  people: string
  image: string
  accent: string
}

type NewMemory = Omit<Memory, 'id' | 'accent'>

const logoImage = '/forever-us-logo-local.png'
const friendshipStart = new Date(2023, 5, 17, 13, 43, 0)

const goodStuffPhotos = [
  {
    id: 'together',
    src: '/hero-besties.jpg',
    alt: 'You and Pratibha together at the platform',
    label: 'You & Pratibha',
    caption: 'same people,',
    highlight: 'new stories',
    date: 'JUN 2023',
  },
  {
    id: 'stickers',
    src: '/hero-selfie-stickers.jpg',
    alt: 'Pratibha cute selfie with mood stickers',
    label: 'Bestie Mood',
    caption: 'unfiltered joy,',
    highlight: 'pure laughs',
    date: 'AUG 2023',
  },
  {
    id: 'sunshine-white',
    src: '/memory-sunshine-white.jpg',
    alt: 'Pratibha glowing smile in white dupatta',
    label: 'Pure Radiance',
    caption: 'that smile,',
    highlight: 'lights up the room',
    date: 'OCT 2023',
  },
  {
    id: 'school-mood',
    src: '/memory-school-mood.jpg',
    alt: 'Pratibha in school red polo resting chin on hand',
    label: 'School Days',
    caption: 'classroom thoughts,',
    highlight: 'endless gossip',
    date: 'NOV 2023',
  },
  {
    id: 'traditional-yellow',
    src: '/memory-traditional-yellow.jpg',
    alt: 'Pratibha in yellow and pink dupatta',
    label: 'Golden Hour',
    caption: 'festive glow,',
    highlight: 'always graceful',
    date: 'DEC 2023',
  },
  {
    id: 'cyan-poshak',
    src: '/memory-cyan-poshak.jpg',
    alt: 'Pratibha in royal sky blue poshak with jewelry',
    label: 'Royal Elegance',
    caption: 'traditional look,',
    highlight: 'heart of gold',
    date: 'FEB 2024',
  },
  {
    id: 'red-dress-selfie',
    src: '/memory-red-dress-selfie.jpg',
    alt: 'Pratibha 4:56 PM casual selfie in red dress',
    label: '4:56 PM Snaps',
    caption: 'casual moments,',
    highlight: 'forever keepsakes',
    date: 'APR 2024',
  },
  {
    id: 'portrait',
    src: '/hero-portrait-inpainted.jpg',
    alt: 'Pratibha looking radiant in traditional attire',
    label: 'Our Sunshine',
    caption: 'always smiling,',
    highlight: 'forever us',
    date: 'JUN 2024',
  },
  {
    id: 'birthday-balloons',
    src: '/memory-birthday-balloons.jpg',
    alt: 'Pratibha birthday celebration with silver balloons',
    label: 'Birthday Magic',
    caption: 'celebration vibes,',
    highlight: 'birthday girl',
    date: 'JUN 2024',
  },
  {
    id: 'temple-darshan',
    src: '/memory-temple-darshan.jpg',
    alt: 'Pratibha at temple shrine with tilak',
    label: 'Temple Peace',
    caption: 'sacred moments,',
    highlight: 'pure devotion',
    date: 'SEP 2023',
  },
  {
    id: 'school-tie',
    src: '/memory-school-uniform-tie.jpg',
    alt: 'Pratibha in school uniform with tie and flower',
    label: 'Uniform Days',
    caption: 'striped shirt & tie,',
    highlight: 'school memories',
    date: 'JUL 2023',
  },
  {
    id: 'concert-dance',
    src: '/memory-concert-dance.jpg',
    alt: 'Pratibha dancing under stage lights in yellow anarkali',
    label: 'Concert Vibes',
    caption: 'lost in the beats,',
    highlight: 'dancing free',
    date: 'NOV 2023',
  },
  {
    id: 'hibiscus-smile',
    src: '/memory-hibiscus-smile.jpg',
    alt: 'Pratibha sweet camera smile with hibiscus in hair',
    label: 'Sweet Hibiscus',
    caption: 'flower in hair,',
    highlight: 'sweetest smile',
    date: 'AUG 2023',
  },
  {
    id: 'silly-pout',
    src: '/memory-silly-pout.jpg',
    alt: 'Pratibha playful thoughtful face with hibiscus',
    label: 'Drama & Chaos',
    caption: 'that look when,',
    highlight: 'plotting mischief',
    date: 'AUG 2023',
  },
  {
    id: 'black-kurti-selfie',
    src: '/memory-black-kurti-selfie.jpg',
    alt: 'Pratibha 10:08 PM selfie in black kurti and bindi',
    label: '10:08 PM Snaps',
    caption: 'late night texts,',
    highlight: 'vintage vibes',
    date: 'JAN 2024',
  },
  {
    id: 'fairylights-evening',
    src: '/memory-fairylights-evening.jpg',
    alt: 'Pratibha under glowing fairy lights tree in yellow dress',
    label: 'Fairy Tale Nights',
    caption: 'twinkling lights,',
    highlight: 'golden memories',
    date: 'OCT 2023',
  },
]

type FriendshipAge = {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
  totalDays: number
}

function getFriendshipAge(now = new Date()): FriendshipAge {
  const start = new Date(friendshipStart)
  if (now < start) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 0 }
  }

  const totalSeconds = Math.floor((now.getTime() - start.getTime()) / 1000)
  const totalDays = Math.floor(totalSeconds / 86400)

  let years = now.getFullYear() - start.getFullYear()
  let months = now.getMonth() - start.getMonth()
  let days = now.getDate() - start.getDate()
  let hours = now.getHours() - start.getHours()
  let minutes = now.getMinutes() - start.getMinutes()
  let seconds = now.getSeconds() - start.getSeconds()

  if (seconds < 0) {
    seconds += 60
    minutes--
  }
  if (minutes < 0) {
    minutes += 60
    hours--
  }
  if (hours < 0) {
    hours += 24
    days--
  }
  if (days < 0) {
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth(), 0)
    days += prevMonthDate.getDate()
    months--
  }
  if (months < 0) {
    months += 12
    years--
  }

  return { years, months, days, hours, minutes, seconds, totalDays }
}

const seededMemories: Memory[] = [
  { id: 1, type: 'photo', title: 'The birthday hello', caption: '1:43 PM. The exact moment our forever started.', date: '', people: 'YOU + PRATIBHA', image: '/hero-besties.jpg', accent: 'yellow' },
  { id: 2, type: 'photo', title: 'Uniform days & quiet mornings', caption: 'Classroom mornings in uniform, counting down minutes until the bell rang.', date: 'JUL 2023', people: 'PRATIBHA', image: '/memory-school-uniform-tie.jpg', accent: 'sage' },
  { id: 3, type: 'photo', title: 'Unfiltered selfie sessions', caption: 'The unofficial photo shoot of two best friends being completely unserious.', date: 'AUG 2023', people: 'YOU + PRATIBHA', image: '/hero-selfie-stickers.jpg', accent: 'coral' },
  { id: 4, type: 'photo', title: 'Temple blessings', caption: 'Quiet marble courtyards, peaceful prayers, and a serene day together.', date: 'SEP 2023', people: 'PRATIBHA', image: '/memory-temple-darshan.jpg', accent: 'lavender' },
  { id: 5, type: 'photo', title: 'That signature smile', caption: 'Warm afternoon and the easiest, most infectious laughter in the room.', date: 'OCT 2023', people: 'PRATIBHA', image: '/memory-sunshine-white.jpg', accent: 'sage' },
  { id: 6, type: 'photo', title: 'Classroom chronicles', caption: 'Somewhere between serious lectures and the whispered jokes only we understood.', date: 'NOV 2023', people: 'YOU + PRATIBHA', image: '/memory-school-mood.jpg', accent: 'lavender' },
  { id: 7, type: 'photo', title: 'Festive cheer & colors', caption: 'Dressed up in vibrant yellow and pink, making every celebration brighter.', date: 'DEC 2023', people: 'PRATIBHA', image: '/memory-traditional-yellow.jpg', accent: 'yellow' },
  { id: 9, type: 'photo', title: 'Royal in sky blue', caption: 'Full traditional poshak, graceful elegance, and the sweetest smile.', date: 'FEB 2024', people: 'PRATIBHA', image: '/memory-cyan-poshak.jpg', accent: 'sage' },
  { id: 10, type: 'photo', title: 'The 4:56 PM snap', caption: 'Proof that any minute of any day is the perfect time for a bestie check-in.', date: 'APR 2024', people: 'PRATIBHA', image: '/memory-red-dress-selfie.jpg', accent: 'coral' },
  { id: 12, type: 'photo', title: 'Silver balloons & birthday joy', caption: 'Celebrating the sweetest soul with cake, glitter, and big smiles.', date: 'JUN 2024', people: 'PRATIBHA', image: '/memory-birthday-balloons.jpg', accent: 'coral' },
  { id: 13, type: 'photo', title: 'Birthday girl, always', caption: 'The cake survived. Our laughter definitely did not stay quiet.', date: '17 JUN 2024', people: 'YOU + PRATIBHA', image: '/hero-portrait-inpainted.jpg', accent: 'lavender' },
  { id: 14, type: 'photo', title: 'Under the fairy lights', caption: 'Glowing lights, cool breeze, and golden festive vibes all around.', date: 'OCT 2023', people: 'PRATIBHA', image: '/memory-fairylights-evening.jpg', accent: 'yellow' },
  { id: 15, type: 'photo', title: 'Live music & dancing free', caption: 'Crowd, loud beats, and dancing like nobody is watching under stage lights.', date: 'NOV 2023', people: 'PRATIBHA', image: '/memory-concert-dance.jpg', accent: 'coral' },
  { id: 16, type: 'photo', title: 'Hibiscus in her hair', caption: 'A casual sweet selfie that turned into one of our absolute favorite portraits.', date: 'AUG 2023', people: 'PRATIBHA', image: '/memory-hibiscus-smile.jpg', accent: 'sage' },
  { id: 17, type: 'photo', title: 'The 10:08 PM check-in', caption: 'Black kurti, traditional bindi, and late evening bestie check-in texts.', date: 'JAN 2024', people: 'PRATIBHA', image: '/memory-black-kurti-selfie.jpg', accent: 'lavender' },
  { id: 18, type: 'photo', title: 'Pensive & playfully dramatic', caption: 'Looking up, plotting the next joke, and being effortlessly cute.', date: 'AUG 2023', people: 'PRATIBHA', image: '/memory-silly-pout.jpg', accent: 'yellow' },
]

const journey = [
  { year: '17 JUN', title: 'The birthday hello', copy: 'At 1:43 PM, in 11th standard, you met Pratibha on her birthday. A very special date got even more special.', mark: '01' },
  { year: '2023', title: 'The friendship takes shape', copy: 'School days, shared jokes, and the easy kind of comfort that makes a new friendship feel familiar.', mark: '02' },
  { year: '2024', title: 'Still choosing each other', copy: 'More conversations, more memories, and the quiet proof that this friendship is growing beautifully.', mark: '03' },
  { year: '2025', title: 'Unbreakable & ever sweeter', copy: 'Bigger dreams and new chapters, but the same chaotic laughs, midnight rants, and comforting check-ins. Proof that besties only get closer with time.', mark: '04' },
  { year: 'NOW', title: 'Forever, one day at a time', copy: 'Every ordinary day with Pratibha is another little story worth keeping.', mark: '05' },
]

const prompts = [
  'What is a tiny moment with this group that you wish you could bottle?',
  'Give a 10-second impression of someone in the group. No names. Everyone guesses.',
  'What song instantly transports you to one of our best days?',
  'Tell the story of the funniest plan that went completely wrong.',
  'If this friendship had a warning label, what would it say?',
  'Name one thing each person here has taught you without realizing it.',
]

type TicTacMark = 'X' | 'O' | null
const winningLines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

function App() {
  const [memories, setMemories] = useState<Memory[]>(() => {
    try {
      const saved = localStorage.getItem('forever-us-memories')
      if (saved) {
        const parsed = JSON.parse(saved)
        const custom = Array.isArray(parsed) ? parsed.filter((item: Memory) => item && item.id > 1000) : []
        return [...seededMemories, ...custom]
      }
      return seededMemories
    } catch { return seededMemories }
  })
  const [score, setScore] = useState(() => Number(localStorage.getItem('forever-us-score') || 0))
  const [friendshipAge, setFriendshipAge] = useState<FriendshipAge>(() => getFriendshipAge())
  const [prompt, setPrompt] = useState('Tap the card to reveal a question or a tiny challenge.')
  const [ticTacBoard, setTicTacBoard] = useState<TicTacMark[]>(Array(9).fill(null))
  const [ticTacTurn, setTicTacTurn] = useState<TicTacMark>('X')
  const [ticTacWins, setTicTacWins] = useState(() => Number(localStorage.getItem('forever-us-tictactoe-wins') || 0))
  const [menuOpen, setMenuOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState('')
  const [form, setForm] = useState<NewMemory>({ type: 'photo', title: '', caption: '', date: '', people: '', image: '' })
  const [activeHeroPhoto, setActiveHeroPhoto] = useState(0)
  const dotRowRef = useRef<HTMLDivElement>(null)

  const currentHeroPhoto = goodStuffPhotos[activeHeroPhoto]
  const otherPhotos = goodStuffPhotos
    .map((photo, originalIndex) => ({ ...photo, originalIndex }))
    .filter((_, idx) => idx !== activeHeroPhoto)
  const leftPolaroid = otherPhotos[0]
  const rightPolaroid = otherPhotos[1]

  const filteredMemories = memories

  useEffect(() => { localStorage.setItem('forever-us-score', String(score)) }, [score])
  useEffect(() => { localStorage.setItem('forever-us-tictactoe-wins', String(ticTacWins)) }, [ticTacWins])
  useEffect(() => { if (toast) { const id = window.setTimeout(() => setToast(''), 2600); return () => window.clearTimeout(id) } }, [toast])
  useEffect(() => {
    const timer = window.setInterval(() => setFriendshipAge(getFriendshipAge()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    const activeDot = dotRowRef.current?.children[activeHeroPhoto] as HTMLElement | undefined
    if (activeDot) {
      activeDot.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
    }
  }, [activeHeroPhoto])

  const customCount = useMemo(() => memories.length - seededMemories.length, [memories.length])

  function revealPrompt() {
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)])
  }

  const ticTacWinner = winningLines.map(([a, b, c]) => ticTacBoard[a] && ticTacBoard[a] === ticTacBoard[b] && ticTacBoard[a] === ticTacBoard[c] ? ticTacBoard[a] : null).find(Boolean) as TicTacMark
  const ticTacDraw = !ticTacWinner && ticTacBoard.every(Boolean)

  function playTicTac(index: number) {
    if (ticTacBoard[index] || ticTacWinner) return
    const nextBoard = [...ticTacBoard]
    nextBoard[index] = ticTacTurn
    setTicTacBoard(nextBoard)
    if (winningLines.some(([a, b, c]) => nextBoard[a] && nextBoard[a] === nextBoard[b] && nextBoard[a] === nextBoard[c])) {
      setTicTacWins((wins) => wins + 1)
    } else {
      setTicTacTurn(ticTacTurn === 'X' ? 'O' : 'X')
    }
  }

  const [loveCount, setLoveCount] = useState(() => Number(localStorage.getItem('forever-us-love') || 100))
  useEffect(() => { localStorage.setItem('forever-us-love', String(loveCount)) }, [loveCount])

  function sendLove() {
    setLoveCount((c) => c + 1)
    setToast('Sent love to Pratibha! ♡')
  }

  function resetTicTac() {
    setTicTacBoard(Array(9).fill(null))
    setTicTacTurn('X')
  }

  function submitMemory(event: FormEvent) {
    event.preventDefault()
    if (!form.title || !form.caption || !form.date || !form.people) return
    const entry: Memory = { ...form, id: Date.now(), accent: ['yellow', 'coral', 'sage', 'lavender'][memories.length % 4] }
    const custom = [...memories.filter((item) => item.id > 1000), entry]
    setMemories([...seededMemories, ...custom])
    localStorage.setItem('forever-us-memories', JSON.stringify(custom))
    setForm({ type: 'photo', title: '', caption: '', date: '', people: '', image: '' })
    setShowForm(false)
    setToast('Memory tucked safely into the scrapbook.')
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div className="site-shell">
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
      <header className="topbar">
        <button className="brand" onClick={() => scrollTo('top')} aria-label="Back to top">
          <img src={logoImage} alt="" className="brand-mark" />
          <TextReveal
            text="forever us"
            as="span"
            fontSize="21px"
            color="#17202b"
            hoverColor="#d75850"
            className="brand-cascade"
          />
        </button>
        <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <button onClick={() => scrollTo('memories')}>Memories</button>
          <button onClick={() => scrollTo('journey')}>Our journey</button>
          <button className="nav-game" onClick={() => scrollTo('game')}><Sparkles size={15} /> Play a round</button>
          <button className="nav-game" onClick={() => scrollTo('tic-tac-toe')}><Grid3X3 size={15} /> Tic Tac Toe</button>
          <button className="nav-thankyou" onClick={() => scrollTo('thank-you')}><Heart size={14} fill="currentColor" /> Thank You</button>
        </nav>
      </header>

      <main id="top">
        <section className="hero section-pad">
          <div className="hero-copy">
            <p className="eyebrow"><Heart size={15} fill="currentColor" /> a little corner of the internet, just for us</p>
            <h1>
              For my one and only bestie,<br />
              <em><HyperText text="Pratibha." className="hero-hyper-text" /></em>
            </h1>
            <div className="hero-actions" style={{ marginTop: 28 }}>
              <button className="button button-dark" onClick={() => scrollTo('memories')}>Open the scrapbook <ArrowUpRight size={17} /></button>
              <button className="text-button" onClick={() => scrollTo('game')}>Need a little joy? <ChevronRight size={16} /></button>
            </div>
            <div className="friendship-timer" aria-label="Friendship timer">
              <div className="timer-heading">
                <Heart size={14} fill="currentColor" />
                <span>friends since <b>17 June 2023 · 1:43 PM</b></span>
              </div>
              <div className="timer-units">
                <div className="timer-unit">
                  <strong>{friendshipAge.years}</strong>
                  <span>{friendshipAge.years === 1 ? 'year' : 'years'}</span>
                </div>
                <span className="unit-sep">·</span>
                <div className="timer-unit">
                  <strong>{friendshipAge.months}</strong>
                  <span>{friendshipAge.months === 1 ? 'month' : 'months'}</span>
                </div>
                <span className="unit-sep">·</span>
                <div className="timer-unit">
                  <strong>{friendshipAge.days}</strong>
                  <span>{friendshipAge.days === 1 ? 'day' : 'days'}</span>
                </div>
              </div>
              <div className="timer-live-row">
                <span className="live-pulse" />
                <span className="live-text">Live:</span>
                <span className="live-clock">
                  <b>{String(friendshipAge.hours).padStart(2, '0')}</b>h{' '}
                  <b>{String(friendshipAge.minutes).padStart(2, '0')}</b>m{' '}
                  <b>{String(friendshipAge.seconds).padStart(2, '0')}</b>s
                </span>
                <span className="milestone-pill">
                  {friendshipAge.totalDays.toLocaleString()} days together ✨
                </span>
              </div>
            </div>
          </div>
          <div className="hero-art" aria-label="A stack of friendship keepsakes">
            <div className="hero-note">THE GOOD<br /><span>stuff</span></div>

            <div className="hero-photo-switch" aria-label="Photo keepsakes navigation">
              <button
                className="switch-arrow"
                onClick={() => setActiveHeroPhoto((curr) => (curr - 1 + goodStuffPhotos.length) % goodStuffPhotos.length)}
                aria-label="Previous keepsake"
                title="Previous photo"
              >
                <ChevronLeft size={14} />
              </button>
              <div className="photo-dots-row" ref={dotRowRef}>
                {goodStuffPhotos.map((photo, idx) => (
                  <button
                    key={photo.id}
                    className={`photo-dot-circle ${activeHeroPhoto === idx ? 'active' : ''}`}
                    onClick={() => setActiveHeroPhoto(idx)}
                    title={`0${idx + 1}: ${photo.label}`}
                    aria-label={`Photo ${idx + 1}: ${photo.label}`}
                  >
                    <span>{idx + 1}</span>
                  </button>
                ))}
              </div>
              <button
                className="switch-arrow"
                onClick={() => setActiveHeroPhoto((curr) => (curr + 1) % goodStuffPhotos.length)}
                aria-label="Next keepsake"
                title="Next photo"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <div
              className="hero-image"
              onClick={() => setActiveHeroPhoto((curr) => (curr + 1) % goodStuffPhotos.length)}
              title="Click to cycle through pictures"
              role="button"
              tabIndex={0}
            >
              <div className="photo-tape" />
              <img src={currentHeroPhoto.src} alt={currentHeroPhoto.alt} />
              <div className="hero-photo-tag">
                <Sparkles size={12} />
                <span>{currentHeroPhoto.label}</span>
              </div>
            </div>

            <div
              className="hero-polaroid polaroid-left"
              onClick={() => setActiveHeroPhoto(leftPolaroid.originalIndex)}
              title={`Click to spotlight ${leftPolaroid.label}`}
              role="button"
              tabIndex={0}
            >
              <div className="polaroid-pin" />
              <div className="polaroid-image">
                <img src={leftPolaroid.src} alt={leftPolaroid.alt} />
              </div>
              <p>{leftPolaroid.caption}<br /><b>{leftPolaroid.highlight}</b></p>
              <span className="polaroid-click-hint">tap to swap</span>
            </div>

            <div
              className="hero-polaroid polaroid-right"
              onClick={() => setActiveHeroPhoto(rightPolaroid.originalIndex)}
              title={`Click to spotlight ${rightPolaroid.label}`}
              role="button"
              tabIndex={0}
            >
              <div className="polaroid-pin" />
              <div className="polaroid-image">
                <img src={rightPolaroid.src} alt={rightPolaroid.alt} />
              </div>
              <p>{rightPolaroid.caption}<br /><b>{rightPolaroid.highlight}</b></p>
              <span className="polaroid-click-hint">tap to swap</span>
            </div>

            <span className="doodle doodle-star">✳</span>
            <span className="doodle doodle-heart">♡</span>
          </div>
        </section>

        <section className="proof-strip"><div><strong>2</strong><span>loud personalities</span></div><div><strong>∞</strong><span>inside jokes</span></div><div><strong>1</strong><span>shared brain cell</span></div><div><strong>100%</strong><span>showing up</span></div></section>

        <section id="memories" className="section-pad section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / the highlight reel</p>
              <h2>Little moments,<br /><em>big evidence.</em></h2>
            </div>
            <button className="button button-outline" onClick={() => setShowForm(true)}><Plus size={17} /> Add a memory</button>
          </div>
          <div className="memory-grid">
            {filteredMemories.map((memory, index) => <article className={`memory-card accent-${memory.accent} ${index === 0 ? 'featured' : ''}`} key={memory.id}>
              <div className="memory-media"><img src={memory.image || '/hero-besties.jpg'} alt={memory.title} />{memory.type === 'video' && <span className="video-badge"><Play size={13} fill="currentColor" /> video</span>}</div>
              <h3>{memory.title}</h3><p>{memory.caption}</p>
            </article>)}
          </div>
          {customCount > 0 && <p className="saved-note"><Check size={15} /> {customCount} memory{customCount > 1 ? 'ies' : 'y'} saved locally in this browser.</p>}
        </section>

        <section id="journey" className="section-pad section-block journey-section"><div className="section-heading"><div><p className="eyebrow">02 / the long way round</p><h2>How we got<br /><em>here.</em></h2></div><p className="section-intro">A very incomplete timeline of the moments that turned “we should hang out sometime” into a whole little universe.</p></div><div className="timeline">{journey.map((item) => <div className="timeline-row" key={item.year}><div className="timeline-mark">{item.mark}</div><div className="timeline-year">{item.year}</div><div className="timeline-copy"><h3>{item.title}</h3><p>{item.copy}</p></div></div>)}</div></section>

        <section id="game" className="section-pad game-section"><div className="game-intro"><p className="eyebrow">03 / tiny game, big feelings</p><h2>Pull a card.<br /><em>Make a memory.</em></h2><p>For when we are together and someone says “what should we do?” Reveal a prompt, be brave, and award points for excellent answers.</p><div className="score-chip"><Trophy size={16} /> <span>group score</span><b>{score}</b></div></div><div className="game-card-wrap"><button className="game-card" onClick={revealPrompt} aria-label="Reveal a friendship prompt"><span className="card-stamp">FOREVER<br />US</span><span className="card-question">{prompt}</span><span className="card-action"><Sparkles size={16} /> tap to reveal</span></button><div className="score-controls"><span>Did someone nail it?</span><button onClick={() => setScore((value) => value + 1)}><Star size={15} /> +1 point</button><button onClick={() => setScore((value) => Math.max(0, value - 1))}>undo</button></div></div></section>

        <section id="tic-tac-toe" className="section-pad section-block tictactoe-section"><div className="section-heading"><div><p className="eyebrow">04 / bestie battle</p><h2>Tic Tac <em>Toe.</em></h2></div><div className="tictactoe-score"><span>round wins</span><b>{ticTacWins}</b><button onClick={() => { setTicTacWins(0); localStorage.setItem('forever-us-tictactoe-wins', '0') }}>reset score</button></div></div><div className="tictactoe-layout"><div><p className="section-intro">A tiny classic for two. <b className="x-text">Aniket is X</b>, <b className="o-text">Pratibha is O</b> — or swap the rules whenever you want.</p><div className="tictactoe-status">{ticTacWinner ? <><Trophy size={16} /> {ticTacWinner === 'X' ? 'Aniket' : 'Pratibha'} wins this round!</> : ticTacDraw ? <>It’s a draw — besties are evenly matched.</> : <>It’s <b className={ticTacTurn === 'X' ? 'x-text' : 'o-text'}>{ticTacTurn === 'X' ? 'Aniket’s' : 'Pratibha’s'}</b> turn.</>}</div><button className="button button-outline" onClick={resetTicTac}><Grid3X3 size={16} /> New round</button></div><div className="tictactoe-board" role="grid" aria-label="Tic Tac Toe board">{ticTacBoard.map((mark, index) => <button key={index} className={`tictactoe-cell ${mark ? `mark-${mark.toLowerCase()}` : ''}`} onClick={() => playTicTac(index)} aria-label={`Square ${index + 1}${mark ? `, ${mark}` : ''}`} role="gridcell">{mark === 'X' ? <img src="/tictac-aniket-v2.jpg" alt="Aniket" /> : mark === 'O' ? <img src="/tictac-pratibha-v2.jpg" alt="Pratibha" /> : null}</button>)}</div></div></section>

        <section id="thank-you" className="section-pad section-block thankyou-section">
          <div className="thankyou-card">
            <div className="thankyou-header">
              <h2>Thank You, Pratibha.<br /><em>For everything, and for just being you.</em></h2>
            </div>

            <div className="thankyou-letter">
              <div className="letter-wax-seal" title="Sealed with love">
                <span>♡</span>
              </div>

              <p className="letter-greeting">Dear Pratibha,</p>

              <p>
                I don’t think I say this nearly enough, but having you in my life is one of the greatest blessings I have ever received. Ever since that 17th of June in 11th standard, my world became noticeably brighter, my laughter so much louder, and every ordinary day so much more meaningful.
              </p>

              <p>
                <strong>Thank you for being my constant.</strong> In a world where everything changes in a heartbeat, your friendship has been the one steady, comforting place I could always count on. Thank you for listening to my thoughts without judgment, for laughing at the silly jokes only we get, and for understanding what I’m feeling even before I find the words to say it out loud.
              </p>


              <p>
                Thank you for being effortlessly kind, fiercely loyal, playfully dramatic, and 100% genuine. With you, I never have to pretend to be anyone else, and that kind of effortless comfort is something truly rare and precious.
              </p>

              <p className="letter-highlight">
                “Whatever tomorrow brings, wherever our lives take us, and however many years pass — you will always have me in your corner, cheering the loudest for you, standing by your side, and thanking the universe that I get to call you my best friend.”
              </p>

              <div className="letter-signoff">
                <p>With all my heart and infinite gratitude,</p>
                <h3>Forever your bestie, <em>Aniket</em> ♡</h3>
              </div>
            </div>

            <div className="thankyou-interactive">
              <button
                type="button"
                className="button button-love"
                onClick={sendLove}
              >
                <Heart size={16} fill="currentColor" /> Send a little love to Pratibha ({loveCount})
              </button>
              <span className="love-hint">Tap whenever you’re grateful for her ✨</span>
            </div>
          </div>
        </section>

        <section className="closing section-pad"><div className="closing-mark"><Heart size={24} fill="currentColor" /></div><p className="eyebrow">same time next week?</p><h2>Here’s to the next<br /><em>ordinary adventure.</em></h2><button className="button button-dark" onClick={() => setShowForm(true)}><ImagePlus size={17} /> Tuck in a new memory</button><p className="closing-foot">Forever Us / a work in progress / updated whenever something funny happens</p></section>
      </main>

      {showForm && <div className="modal-backdrop" onClick={() => setShowForm(false)}><div className="memory-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowForm(false)} aria-label="Close"><X /></button><p className="eyebrow">add to the archive</p><h2>What should we<br /><em>remember?</em></h2><form onSubmit={submitMemory}><div className="form-row"><label>Memory title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="The night we…" /></label><label>Date / year<input required value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} placeholder="DEC 2024" /></label></div><label>Who was there?<input required value={form.people} onChange={(event) => setForm({ ...form, people: event.target.value })} placeholder="ALL OF US" /></label><label>Tell the tiny story<textarea required value={form.caption} onChange={(event) => setForm({ ...form, caption: event.target.value })} placeholder="The part we will still be laughing about…" rows={3} /></label><label>Photo or video URL <span className="optional">optional</span><input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="https://…" /></label><button className="button button-dark form-submit" type="submit">Save this one <Heart size={16} fill="currentColor" /></button><p className="form-hint">Your memory stays in this browser — no account, no fuss.</p></form></div></div>}
      <AIChatbox />
    </div>
  )
}

export default App
