import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

/**
 * Pastdan ochiladigan oq varaqa — do'konning standart «raskop» holati.
 */
const Sheet = ({ open, onClose, title, subtitle, children }: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
}) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50"
          style={{ background: 'rgba(14,26,18,0.5)' }}
        />
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 340 }}
          className="fixed bottom-0 left-0 right-0 z-50 max-w-[430px] mx-auto"
          style={{ background: '#FFFFFF', borderRadius: '18px 18px 0 0', padding: '10px 16px 26px', maxHeight: '80vh', overflowY: 'auto' }}
        >
          <div className="w-10 h-1 rounded-full mx-auto mb-3" style={{ background: '#E9EEE8' }} />
          <p className="text-[11px] font-extrabold" style={{ color: '#6B7C66', letterSpacing: '0.14em' }}>{title}</p>
          {subtitle && <p className="mt-1 text-[12.5px]" style={{ color: '#6B7C66' }}>{subtitle}</p>}
          <div className="mt-2">{children}</div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
)

export default Sheet
