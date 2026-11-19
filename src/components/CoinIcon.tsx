import { Image } from 'react-native'

/** HDP tangasi — oltin π medali. `size` — diametr (px). */
export const CoinIcon = ({ size = 20 }: { size?: number }) => (
  <Image
    source={require('../assets/coin.png')}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
)
