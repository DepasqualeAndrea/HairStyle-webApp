import { Tabs } from 'expo-router';
import { Home, Search, ShoppingBag, Calendar, User } from 'lucide-react-native';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#1C1C1E',
                    borderTopColor: '#2C2C2E',
                    borderTopWidth: 1,
                    height: 70,
                    paddingBottom: 10,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: '#FF4D6D',
                tabBarInactiveTintColor: '#6B7280',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: (props) => <Home {...props} />,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Servizi',
                    tabBarIcon: (props) => <Search {...props} />,
                }}
            />
            <Tabs.Screen
                name="shop"
                options={{
                    title: 'Shop',
                    tabBarIcon: (props) => <ShoppingBag {...props} />,
                }}
            />
            <Tabs.Screen
                name="bookings"
                options={{
                    title: 'Appuntamenti',
                    tabBarIcon: (props) => <Calendar {...props} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profilo',
                    tabBarIcon: (props) => <User {...props} />,
                }}
            />
        </Tabs>
    );
}
