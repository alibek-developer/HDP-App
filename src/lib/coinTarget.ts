/** Sarlavhadagi tanga hisoblagich markazi (oyna koordinatalarida) — uchayotgan tanga shu yerga qo'nadi */
let target = { x: 0, y: 0 }

export const setCoinTarget = (x: number, y: number) => {
  target = { x, y }
}

export const getCoinTarget = () => target
