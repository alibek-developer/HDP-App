import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import AuthScreen from './AuthScreen'
import type { RootStackParamList } from '../navigation/types'

const LoginScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Login'>) => (
  <AuthScreen initialMode="login" navigation={navigation} />
)

export default LoginScreen
