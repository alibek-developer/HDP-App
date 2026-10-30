import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSolveStore } from '../store/useStore'
import { mockDailyProblem } from '../data/mockData'

const SolveScreen = () => {
  const navigate = useNavigate()
  const { selectedAnswer, isChecked, isCorrect, setAnswer, checkAnswer, reset } = useSolveStore()

  const handleAnswerSelect = (answer: number) => {
    if (isChecked) return
    setAnswer(answer)
  }

  const handleCheck = () => {
    if (selectedAnswer === null) return
    checkAnswer()
  }

  const handleNext = () => {
    reset()
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-surface overflow-y-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={() => navigate('/home')} className="text-text-muted">←</button>
        <div className="text-center">
          <span className="text-xs text-text-muted">#{mockDailyProblem.id} · ALGEBRA</span>
        </div>
        <div className="flex gap-2">
          <span className="bg-coin/10 text-coin px-2 py-1 rounded text-xs">+{mockDailyProblem.rewardCoin} 🪙</span>
          <span className="bg-xp/10 text-xp px-2 py-1 rounded text-xs">+{mockDailyProblem.rewardXp} ⚡</span>
        </div>
      </div>

      {/* Problem Card */}
      <div className="mx-4 bg-surface-card rounded-2xl shadow-card p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-primary text-white text-xs px-2 py-1 rounded">🎯 KUNLIK MEGA MASALA</span>
          <span className="bg-primary-light text-primary-dark text-xs px-2 py-1 rounded">✓ HDP Ekspert Tanlov</span>
        </div>
        
        <div className="text-xs text-text-muted mb-2">KANONIK KO'RINISH</div>
        <code className="text-2xl text-primary font-bold font-mono block mb-3">
          {mockDailyProblem.formula}
        </code>
        
        <p className="text-text-secondary">
          Tenglama <span className="font-bold">ikkita har xil musbat haqiqiy ildizga</span> ega bo'lsa, <span className="font-bold">a</span> ning barcha qiymatlar sohasini toping.
        </p>
      </div>

      {/* Conditions */}
      <div className="px-4 mb-4 grid grid-cols-3 gap-2">
        {['D &gt; 0', 'x₁ + x₂ &gt; 0', 'x₁ · x₂ &gt; 0'].map((condition, i) => (
          <div key={i} className="bg-surface-low rounded-lg p-2 text-center">
            <code className="text-sm font-mono text-text-secondary" dangerouslySetInnerHTML={{ __html: condition }} />
          </div>
        ))}
      </div>

      {/* Answer Selection */}
      <div className="px-4 mb-4">
        <div className="text-sm text-text-muted mb-3">TO'G'RI JAVOBNI TANLANG · 1 ta urinish</div>
        <div className="grid grid-cols-2 gap-3">
          {mockDailyProblem.options.map((option, i) => {
            let className = 'bg-surface-card border border-surface-border'
            
            if (isChecked) {
              if (option === mockDailyProblem.correct) {
                className = 'bg-primary border-primary text-white'
              } else if (option === selectedAnswer && !isCorrect) {
                className = 'bg-error/10 border-error text-error'
              }
            } else if (selectedAnswer === option) {
              className = 'bg-primary-container border-primary'
            }

            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAnswerSelect(option)}
                className={`${className} rounded-xl p-4 font-semibold text-xl`}
                disabled={isChecked}
              >
                {option}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Check Button */}
      {!isChecked && selectedAnswer !== null && (
        <div className="px-4 mb-4">
          <button
            onClick={handleCheck}
            className="w-full bg-primary text-white rounded-full py-4 font-bold"
          >
            Tekshirish
          </button>
        </div>
      )}

      {/* Solution Section (shown after check) */}
      {isChecked && (
        <div className="px-4 pb-4">
          {/* Solution Steps */}
          <div className="space-y-3 mb-4">
            {[
              { step: 1, title: 'Diskriminantni toping', desc: 'D = b² - 4ac = (-2a)² - 4·1·(a+6) = 4a² - 4a - 24 = 4(a² - a - 6)' },
              { step: 2, title: 'Shartlarni qo\'llang', desc: 'D &gt; 0 → a² - a - 6 &gt; 0 → (a-3)(a+2) &gt; 0 → a ∈ (-∞, -2) ∪ (3, ∞)' },
              { step: 3, title: 'Ildizlar shartini tekshiring', desc: 'x₁ + x₂ = 2a &gt; 0 → a &gt; 0, x₁·x₂ = a+6 &gt; 0 → a &gt; -6' },
            ].map((item) => (
              <div key={item.step} className="bg-surface-card rounded-xl border border-surface-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded">{item.step}</span>
                  <span className="text-xs text-text-muted">Qadam</span>
                </div>
                <h4 className="font-semibold text-text-primary mb-2">{item.title}</h4>
                <code className="text-sm font-mono text-text-secondary bg-surface-low rounded p-2 block" dangerouslySetInnerHTML={{ __html: item.desc }} />
              </div>
            ))}
          </div>

          {/* Quick Method */}
          <div className="bg-primary-container rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary">⚡</span>
              <span className="bg-primary text-white text-xs px-2 py-1 rounded">30 soniya</span>
            </div>
            <h4 className="font-semibold text-text-primary mb-2">HDP Tezkor Usul</h4>
            <p className="text-sm text-text-secondary" dangerouslySetInnerHTML={{ __html: 'Barcha shartlarni birlashtirganda: a &gt; 3. Shuning uchun javob: a ∈ (3, ∞)' }} />
          </div>

          {/* Result Card */}
          <div className="bg-primary-container rounded-2xl p-4">
            {isCorrect ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">⭐</span>
                  <span className="font-bold text-text-primary">To'g'ri javob belgilandi!</span>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 mb-4"
                >
                  <span className="bg-coin/10 text-coin px-3 py-1 rounded-full text-sm">+{mockDailyProblem.rewardCoin} 🪙</span>
                  <span className="bg-xp/10 text-xp px-3 py-1 rounded-full text-sm">+{mockDailyProblem.rewardXp} ⚡</span>
                </motion.div>
                <button
                  onClick={handleNext}
                  className="w-full bg-primary text-white rounded-full py-3 font-semibold"
                >
                  Tushundim, keyingi misol →
                </button>
                <button className="w-full text-primary text-sm mt-2">
                  ▶ Yechimni videoda ko'rish (1:45)
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">✗</span>
                  <span className="font-bold text-error">Noto'g'ri javob</span>
                </div>
                <p className="text-sm text-text-muted mb-4">
                  To'g'ri javob: {mockDailyProblem.correct}
                </p>
                <button
                  onClick={reset}
                  className="w-full bg-primary text-white rounded-full py-3 font-semibold"
                >
                  Qayta urinish
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-surface-card border-t border-surface-border max-w-mobile mx-auto">
        <div className="flex">
          <button className="flex-1 py-3 text-sm text-text-muted border-r border-surface-border">≡ Qoralama</button>
          <button className="flex-1 py-3 text-sm text-text-muted border-r border-surface-border">📊 Tahlil</button>
          <button className="flex-1 py-3 text-sm text-primary font-semibold">Tekshirish →</button>
        </div>
      </div>
    </div>
  )
}

export default SolveScreen
