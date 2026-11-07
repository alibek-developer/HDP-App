import { View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BottomNav, navBottomSpace } from '../components/BottomNav'
import HomeScreen from '../screens/HomeScreen'
import ProblemsScreen from '../screens/ProblemsScreen'
import ShopScreen from '../screens/ShopScreen'
import ProfileScreen from '../screens/ProfileScreen'
import { ROUTE_TAB, TAB_ROUTE } from './types'
import type { TabParamList } from './types'
import { C } from '../theme/tokens'

/**
 * Pastki tab'lar — alohida navigator. Ekranlar navni o'zi chizmaydi;
 * `BottomNav` faqat shu yerda bir marta turadi va tab almashinuvi
 * `shift` animatsiyasi bilan ketadi (stack push emas — teskari effekt yo'q).
 */

const Tab = createBottomTabNavigator<TabParamList>()

const TabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets()
  const current = state.routes[state.index].name as keyof TabParamList

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: navBottomSpace(insets.bottom),
      }}
    >
      <BottomNav
        active={ROUTE_TAB[current]}
        onSelect={key => navigation.navigate(TAB_ROUTE[key])}
      />
    </View>
  )
}

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'shift',
      sceneStyle: { backgroundColor: C.canvas },
    }}
    tabBar={props => <TabBar {...props} />}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Problems" component={ProblemsScreen} />
    <Tab.Screen name="Shop" component={ShopScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
)

export default MainTabs
