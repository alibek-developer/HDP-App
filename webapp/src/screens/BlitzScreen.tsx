import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Trophy, Zap, Flame } from 'lucide-react'
import { useState } from 'react'

const BlitzScreen = () => {
  const navigate = useNavigate()
  const [isStarted, setIsStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [score, setScore] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const questions = [
    { question: '2x² - 8 = 0 tenglamaning ildizlari yig\'indisi?', options: ['0', '2', '4', '-2'], correct: 0 },
    { question: 'log₂8 = ?', options: ['2', '3', '4', '8'], correct: 1 },
    { question: 'sin(90°) = ?', options: ['0', '1', '-1', '0.5'], correct: 1 },
    { question: '√144 = ?', options: ['10', '11', '12', '14'], correct: 2 },
  ]

  const handleStart = () => {
    setIsStarted(true)
    // Timer logic would go here
  }

  const handleAnswer = (index: number) => {
    if (index === questions[currentQuestion].correct) {
      setScore(score + 10)
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      navigate('/home')
    }
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-surface overflow-y-auto pb-20">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('/home')} className="flex items-center gap-2">
            <ArrowLeft size={20} className="text-text-muted" />
            <span className="text-text-primary font-medium">Blitz Duel</span>
          </button>
          <div className="flex items-center gap-2 bg-surface-low px-3 py-1 rounded-full">
            <Flame size={16} className="text-primary" />
            <span className="text-text-primary font-semibold">5 kunlik streak</span>
          </div>
        </div>

        {/* Hero */}
        <div className="mx-4 text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full mb-4">
            <Zap size={18} />
            <span className="font-semibold">⚡ Blitz Duel</span>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Tezkor matematika dueli
          </h2>
          <p className="text-text-secondary">
            30 soniya ichida 4 ta masalani yeching!
          </p>
        </div>

        {/* Stats */}
        <div className="mx-4 grid grid-cols-3 gap-3 mb-6">
          <div className="bg-surface-card rounded-xl p-3 text-center">
            <Clock size={24} className="text-primary mx-auto mb-2" />
            <div className="text-xl font-bold text-text-primary">30s</div>
            <div className="text-xs text-text-muted">Vaqt</div>
          </div>
          <div className="bg-surface-card rounded-xl p-3 text-center">
            <Trophy size={24} className="text-coin mx-auto mb-2" />
            <div className="text-xl font-bold text-text-primary">40</div>
            <div className="text-xs text-text-muted">Max ball</div>
          </div>
          <div className="bg-surface-card rounded-xl p-3 text-center">
            <Flame size={24} className="text-xp mx-auto mb-2" />
            <div className="text-xl font-bold text-text-primary">+50</div>
            <div className="text-xs text-text-muted">XP</div>
          </div>
        </div>

        {/* Rules */}
        <div className="mx-4 bg-surface-card rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-text-primary mb-3">Qoidalari</h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              Har bir to'g'ri javob 10 ball
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              Noto'g'ri javob ball olib tashlamaydi
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">•</span>
              Vaqt tugaganda test tugaydi
            </li>
          </ul>
        </div>

        {/* Start Button */}
        <div className="mx-4">
          <button
            onClick={handleStart}
            className="w-full bg-primary text-white rounded-full py-4 font-bold text-lg"
          >
            ⚡ Duelni Boshlash
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface overflow-y-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={() => navigate('/home')} className="text-text-muted">←</button>
        <div className="flex items-center gap-2">
          <span className="text-text-muted">{currentQuestion + 1}/{questions.length}</span>
          <div className="bg-primary text-white px-3 py-1 rounded-full font-semibold">
            {timeLeft}s
          </div>
        </div>
        <div className="text-text-primary font-bold">{score} ball</div>
      </div>

      {/* Timer Bar */}
      <div className="mx-4 mb-4">
        <div className="w-full bg-surface-low rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mx-4 bg-surface-card rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-bold text-text-primary text-center mb-6">
          {questions[currentQuestion].question}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {questions[currentQuestion].options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="bg-surface-low border border-surface-border rounded-xl p-4 text-lg font-semibold text-text-primary hover:bg-primary-container hover:border-primary transition-all"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="mx-4 flex justify-center gap-2">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < currentQuestion ? 'bg-primary' : i === currentQuestion ? 'bg-primary' : 'bg-surface-low'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default BlitzScreen
