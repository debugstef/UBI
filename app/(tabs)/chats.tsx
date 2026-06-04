import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Card, Screen } from '../../components/ui';
import { events } from '../../lib/data';
import { colors } from '../../lib/theme';
export default function Chats(){return <Screen><ScrollView contentContainerStyle={styles.c}><Text style={styles.k}>Chats contextuales</Text><Text style={styles.t}>Cada chat vive dentro de un evento.</Text>{events.map(e=><Card key={e.id} style={styles.card}><Text style={styles.title} onPress={()=>router.push(`/chat/${e.id}`)}>{e.title}</Text><Text style={styles.p}>Host fijó: entrada por lista. Chat expira después del evento.</Text></Card>)}</ScrollView></Screen>}
const styles=StyleSheet.create({c:{padding:20,paddingTop:62,paddingBottom:120,gap:14},k:{color:colors.gold,fontWeight:'900'},t:{color:colors.text,fontSize:33,fontWeight:'900'},card:{gap:6},title:{color:colors.neonGreen,fontSize:18,fontWeight:'900'},p:{color:colors.muted,lineHeight:21}});
