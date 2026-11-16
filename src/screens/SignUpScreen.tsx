import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import AuthScreen from './AuthScreen'
import type { RootStackParamList } from '../navigation/types'

const SignUpScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'SignUp'>) => (
  <AuthScreen initialMode="signup" navigation={navigation} />
)

export default SignUpScreen
