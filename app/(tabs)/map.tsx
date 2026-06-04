import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Chip, Screen } from '../../components/ui';
import { LiveMap } from '../../components/LiveMap';
import { EventCard } from '../../components/EventCard';
import { events, stores } from '../../lib/data';
import { colors } from '../../lib/theme';

export default function Map(){const e=events[0];return <Screen><View style={styles.root}>
<View style={styles.header}><View><Text style={styles.kicker}>Lima · ahora</Text><Text style={styles.title}>Mapa vivo</Text></View><Pressable style={styles.icon} onPress={()=>router.push('/layers')}><Ionicons name="layers" color={colors.gold} size={22}/></Pressable></View>
<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>{['Cerca','Trending','Amigos','Tiendas','Plan B','18+'].map((x,i)=><Chip key={x} label={x} active={i<2}/>)}</ScrollView>
<View style={styles.map}><LiveMap events={events} stores={stores} onEventPress={(id)=>router.push(`/event/${id}`)} /><Pressable style={styles.sos} onPress={()=>router.push('/sos')}><Text style={styles.sosText}>⚡ Resolver</Text></Pressable></View>
<Card style={styles.sheet}><Text style={styles.sheetTitle}>🔥 {e.title}</Text><Text style={styles.sheetText}>{e.people}+ personas · {e.music.join(' / ')} · S/ {e.price} · {e.friends} amigos</Text><View style={styles.row}><Button label="Ver detalle" onPress={()=>router.push(`/event/${e.id}`)} /><Button label="Plan B" variant="ghost" onPress={()=>router.push('/plan-b')} /></View></Card>
</View></Screen>}
const styles=StyleSheet.create({root:{flex:1,paddingTop:58},header:{paddingHorizontal:18,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},kicker:{color:colors.gold,fontWeight:'900'},title:{color:colors.text,fontSize:34,fontWeight:'900'},icon:{width:48,height:48,borderRadius:18,borderWidth:1,borderColor:colors.borderGold,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(3,16,13,.8)'},filters:{gap:10,paddingHorizontal:18,paddingVertical:14},map:{flex:1,marginHorizontal:12,borderRadius:30,overflow:'hidden',borderWidth:1,borderColor:colors.borderGreen},sos:{position:'absolute',top:14,right:14,backgroundColor:colors.gold,borderRadius:999,paddingHorizontal:14,paddingVertical:10},sosText:{fontWeight:'900',color:colors.background},sheet:{margin:12,marginBottom:94},sheetTitle:{color:colors.text,fontSize:20,fontWeight:'900'},sheetText:{color:colors.muted,marginVertical:10,lineHeight:21},row:{flexDirection:'row',gap:10}});
