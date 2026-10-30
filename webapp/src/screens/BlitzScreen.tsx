import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { triggerHaptic } from '../lib/telegram'

const BlitzScreen = () => {
  const navigate = useNavigate()
  const [isStarted, setIsStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [score, setScore] = useState(0)
  const [opponentScore, setOpponentScore] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const questions = [
    { question: '2x² - 8 = 0 tenglamaning musbat ildizini toping:', options: ['2', '4', '8', '16'], correct: 0 },
    { question: 'log₂32 = ?', options: ['4', '5', '6', '8'], correct: 1 },
    { question: 'sin(30°) = ?', options: ['√3/2', '1/2', '1', '0'], correct: 1 },
    { question: '√196 = ?', options: ['12', '13', '14', '16'], correct: 2 },
    { question: 'f(x) = x³ hosilasini toping:', options: ['3x²', '2x', '3x', 'x²'], correct: 0 },
  ]

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isStarted && !isFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setIsFinished(true)
            triggerHaptic('warning')
            return 0
          }
          return prev - 1
        })

        // Simulated live opponent solving
        if (Math.random() > 0.65) {
          setOpponentScore((s) => s + 10)
        }
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isStarted, isFinished, timeLeft])

  const handleStart = () => {
    triggerHaptic('medium')
    setIsStarted(true)
  }

  const handleAnswer = (index: number) => {
    const isCorrect = index === questions[currentQuestion].correct
    if (isCorrect) {
      triggerHaptic('success')
      setScore((s) => s + 10)
    } else {
      triggerHaptic('error')
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1)
    } else {
      setIsFinished(true)
      triggerHaptic('success')
    }
  }

  // Lobby view before starting
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-[#FAF8FF] pb-8 text-[#131B2E] select-none flex flex-col justify-between p-4">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between py-2">
            <button
              onClick={() => { triggerHaptic('light'); navigate('/home') }}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-800">
              <span>🔥</span>
              <span>12 kunlik streak</span>
            </div>
          </div>

          {/* Hero */}
          <div className="text-center my-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#006C49] to-emerald-400 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-700/20 text-3xl">
              ⚔️
            </div>

            <h1 className="text-2xl font-black text-[#131B2E]">BLITZ DUEL · 1v1</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-[260px] mx-auto">
              30 soniya ichida raqibingizdan ko'proq matematik savolga javob bering!
            </p>
          </div>

          {/* Opponent Card Preview */}
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              TOPILGAN RAQIB
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                  JM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#131B2E]">Jasur_math</h4>
                  <p className="text-[11px] text-slate-500">1,240 XP • Toshkent</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full">
                Online
              </span>
            </div>
          </div>

          {/* Match Parameters Grid */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            <div className="bg-white rounded-2xl p-3 text-center border border-slate-100 shadow-2xs">
              <div className="text-sm font-black text-[#131B2E]">30s</div>
              <div className="text-[10px] text-slate-400">Vaqt</div>
            </div>
            <div className="bg-white rounded-2xl p-3 text-center border border-slate-100 shadow-2xs">
              <div className="text-sm font-black text-[#006C49]">+30 🪙</div>
              <div className="text-[10px] text-slate-400">Yutuq Coin</div>
            </div>
            <div className="bg-white rounded-2xl p-3 text-center border border-slate-100 shadow-2xs">
              <div className="text-sm font-black text-blue-600">+50 XP</div>
              <div className="text-[10px] text-slate-400">Tajriba</div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div>
          <button
            onClick={handleStart}
            className="w-full bg-[#006C49] hover:bg-[#00573a] text-white py-4 rounded-full font-bold text-sm shadow-[0_8px_20px_rgba(0,108,73,0.3)] flex items-center justify-center gap-2"
          >
            <span>Duelni Boshlash</span>
            <span>⚡</span>
          </button>
        </div>
      </div>
    )
  }

  // Finished state
  if (isFinished) {
    const isWinner = score >= opponentScore
    return (
      <div className="min-h-screen bg-[#FAF8FF] flex flex-col justify-between p-5 text-center select-none">
        <div className="my-auto">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 text-4xl shadow-md">
            {isWinner ? '🏆' : '🤝'}
          </div>

          <h2 className="text-2xl font-black text-[#131B2E] mb-1">
            {isWinner ? 'G\'alaba!' : 'Yaxshi bellashuv!'}
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            {isWinner ? 'Siz Jasur_math ustidan g\'alaba qozondingiz!' : 'Keyingi safar albatta yutasiz!'}
          </p>

          {/* Scores summary */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-around mb-6">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Siz</span>
              <div className="text-3xl font-black text-[#006C49] font-mono">{score}</div>
            </div>
            <div className="text-xl font-black text-slate-300">:</div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Jasur_math</span>
              <div className="text-3xl font-black text-slate-600 font-mono">{opponentScore}</div>
            </div>
          </div>

          {/* Rewards */}
          {isWinner && (
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full font-bold text-xs text-emerald-800">
              <span>🪙 +30 Coin olindi</span>
              <span>•</span>
              <span>⚡ +50 XP</span>
            </div>
          )}
        </div>

        <button
          onClick={() => { triggerHaptic('medium'); navigate('/home') }}
          className="w-full bg-[#006C49] text-white py-4 rounded-full font-bold text-sm shadow-md"
        >
          Bosh sahifaga qaytish →
        </button>
      </div>
    )
  }

  // Active Game State
  return (
    <div className="min-h-screen bg-[#FAF8FF] pb-8 text-[#131B2E] select-none flex flex-col justify-between p-4">
      <div>
        {/* Top Battle Status */}
        <div className="flex items-center justify-between mb-4">
          {/* User Score */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#006C49] text-white font-bold text-xs flex items-center justify-center">
              Siz
            </div>
            <span className="font-mono font-black text-base text-[#006C49]">{score}</span>
          </div>

          {/* Timer Pill */}
          <div className={`px-4 py-1.5 rounded-full font-mono font-black text-sm flex items-center gap-1 shadow-xs ${
            timeLeft <= 5 ? 'bg-rose-500 text-white animate-pulse' : 'bg-white border border-slate-200 text-[#131B2E]'
          }`}>
            <span>⏱</span>
            <span>{timeLeft}s</span>
          </div>

          {/* Opponent Score */}
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-base text-slate-600">{opponentScore}</span>
            <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
              JM
            </div>
          </div>
        </div>

        {/* Progress Bar of Question */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
          <span>Savol {currentQuestion + 1} / {questions.length}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5 mb-6 overflow-hidden">
          <div
            className="h-full bg-[#006C49] transition-all"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center mb-6"
          >
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
              BLITZ SAVOL
            </span>
            <h2 className="text-lg font-bold text-[#131B2E] font-serif leading-snug">
              {questions[currentQuestion].question}
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Answer Buttons 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          {questions[currentQuestion].options.map((opt, i) => (
            <motion.button
              key={opt}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(i)}
              className="p-4 bg-white hover:bg-emerald-50 active:bg-emerald-100 border border-slate-200 rounded-2xl font-mono text-base font-extrabold text-[#131B2E] shadow-2xs transition-all"
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-400">
        To'g'ri javoblar hisoblanmoqda...
      </div>
    </div>
  )
}

export default BlitzScreen
