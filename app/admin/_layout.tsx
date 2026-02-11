import { Tabs } from 'expo-router';
import { LayoutDashboard, Calendar, Scissors, ClipboardList } from 'lucide-react-native';

export default function AdminLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#FF4D6D',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    backgroundColor: '#1A1A1A',
                    borderTopColor: '#2C2C2E',
                    borderTopWidth: 1,
                    height: 65,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: (props) => <LayoutDashboard {...props} />,
                }}
            />
            <Tabs.Screen
                name="appointments"
                options={{
                    title: 'Appuntamenti',
                    tabBarIcon: (props) => <ClipboardList {...props} />,
                }}
            />
            <Tabs.Screen
                name="calendar"
                options={{
                    title: 'Calendario',
                    tabBarIcon: (props) => <Calendar {...props} />,
                }}
            />
            <Tabs.Screen
                name="services"
                options={{
                    title: 'Servizi',
                    tabBarIcon: (props) => <Scissors {...props} />,
                }}
            />
        </Tabs>
    );
}
