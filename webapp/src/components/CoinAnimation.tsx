import { motion } from 'framer-motion'

interface CoinAnimationProps {
  show: boolean
}

const CoinAnimation = ({ show }: CoinAnimationProps) => {
  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: [0, 1, 1, 0], y: -40 }}
      transition={{ duration: 0.8 }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl"
    >
      🪙
    </motion.div>
  )
}

export default CoinAnimation
