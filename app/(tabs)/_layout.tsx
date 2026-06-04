import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../lib/theme';

export default function TabsLayout(){return <Tabs screenOptions={{headerShown:false,tabBarStyle:{backgroundColor:'#03100D',borderTopColor:'rgba(247,200,115,.22)',height:82,paddingBottom:18,paddingTop:8},tabBarActiveTintColor:colors.neonGreen,tabBarInactiveTintColor:colors.dim}}>
<Tabs.Screen name="map" options={{title:'Mapa',tabBarIcon:({color,size})=><Ionicons name="map" color={color} size={size}/>}} />
<Tabs.Screen name="feed" options={{title:'Feed',tabBarIcon:({color,size})=><Ionicons name="play-circle" color={color} size={size}/>}} />
<Tabs.Screen name="create" options={{title:'Crear',tabBarIcon:({color,size})=><Ionicons name="add-circle" color={color} size={size+8}/>}} />
<Tabs.Screen name="chats" options={{title:'Chats',tabBarIcon:({color,size})=><Ionicons name="chatbubbles" color={color} size={size}/>}} />
<Tabs.Screen name="profile" options={{title:'Perfil',tabBarIcon:({color,size})=><Ionicons name="person" color={color} size={size}/>}} />
</Tabs>}
