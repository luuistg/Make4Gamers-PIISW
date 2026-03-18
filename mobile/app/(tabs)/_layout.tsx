import { StyleSheet, View } from 'react-native'
import { Tabs } from 'expo-router'
import { House, Swords, Trophy, UserRound } from 'lucide-react-native'

import { m4gTheme } from '@/constants/theme'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: m4gTheme.colors.background,
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: m4gTheme.colors.lime,
        tabBarInactiveTintColor: m4gTheme.colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarBackground: () => <View style={styles.tabBarBackground} />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <House color={color} size={size} strokeWidth={2.2} />,
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Juegos',
          tabBarIcon: ({ color, size }) => <Swords color={color} size={size} strokeWidth={2.2} />,
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: 'Ranking',
          tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} strokeWidth={2.2} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Cuenta',
          tabBarIcon: ({ color, size }) => (
            <UserRound color={color} size={size} strokeWidth={2.2} />
          ),
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    height: 78,
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: 'transparent',
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderWidth: 1,
    borderColor: m4gTheme.colors.border,
    shadowColor: '#000000',
    shadowOpacity: 0.34,
    shadowRadius: 22,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    elevation: 16,
  },
  tabBarItem: {
    paddingTop: 6,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
})
