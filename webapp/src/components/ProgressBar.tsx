import { motion } from 'framer-motion'

interface ProgressBarProps {
  progress: number
  duration?: number
}

const ProgressBar = ({ progress, duration = 1.5 }: ProgressBarProps) => {
  return (
    <div className="w-full bg-surface-low rounded-full h-2 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration, ease: 'easeInOut' }}
        className="h-full bg-primary rounded-full"
      />
    </div>
  )
}

export default ProgressBar
