/** KK.OO.YYYY sanadan yosh. Noto'g'ri sana uchun 0 qaytaradi. */
export const ageOn = (birthDate: string, at = new Date()) => {
  const [d, m, y] = birthDate.split('.').map(Number)
  if (!d || !m || !y) return 0
  let age = at.getFullYear() - y
  const beforeBirthday = at.getMonth() + 1 < m || (at.getMonth() + 1 === m && at.getDate() < d)
  if (beforeBirthday) age -= 1
  return Math.max(0, age)
}

/** Tug'ilgan sana -> o'quv bosqichi. 7 yoshda 1-sinf, 18 yoshdan keyin bitiruvchi. */
export const gradeFromBirthDate = (birthDate: string) => {
  const age = ageOn(birthDate)
  if (age >= 18) return 'Bitirganman'
  return `${Math.min(11, Math.max(1, age - 6))}-sinf`
}
