import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Screen } from '../../components/ui';
import { StoryCard } from '../../components/StoryCard';
import { events } from '../../lib/data';
import { colors } from '../../lib/theme';
export default function Feed(){return <Screen><ScrollView contentContainerStyle={styles.c}><Text style={styles.k}>Historias para decidir</Text><Text style={styles.t}>Así está la noche</Text><Text style={styles.p}>El feed no reemplaza al mapa: cada historia vuelve a un evento o lugar.</Text>{events.map(e=><StoryCard key={e.id} event={e} onPress={()=>router.push(`/event/${e.id}`)}/>)}</ScrollView></Screen>}
const styles=StyleSheet.create({c:{padding:20,paddingTop:62,paddingBottom:120,gap:14},k:{color:colors.gold,fontWeight:'900'},t:{color:colors.text,fontSize:34,fontWeight:'900'},p:{color:colors.muted,lineHeight:22}});
