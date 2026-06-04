import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { EventCard } from '../components/EventCard';
import { Card, Screen } from '../components/ui';
import { events } from '../lib/data';
import { colors } from '../lib/theme';
export default function PlanB(){return <Screen><ScrollView contentContainerStyle={styles.c}><Text style={styles.back} onPress={()=>router.back()}>← Resolver</Text><Text style={styles.k}>Plan B</Text><Text style={styles.t}>Si el evento murió, está lleno o se canceló.</Text><Card><Text style={styles.card}>UBI sugiere hotspots activos, eventos con amigos, after cercano y tienda en ruta.</Text></Card>{events.slice(1).map(e=><EventCard key={e.id} event={e} onPress={()=>router.push(`/event/${e.id}`)}/>)}</ScrollView></Screen>}
const styles=StyleSheet.create({c:{padding:20,paddingTop:58,paddingBottom:120,gap:14},back:{color:colors.neonGreen,fontWeight:'900'},k:{color:colors.gold,fontWeight:'900'},t:{color:colors.text,fontSize:34,fontWeight:'900',lineHeight:38},card:{color:colors.muted,lineHeight:22}});
