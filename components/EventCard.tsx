import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from './ui';
import { UbiEvent } from '../lib/types';
import { colors } from '../lib/theme';
export function EventCard({event,onPress}:{event:UbiEvent;onPress?:()=>void}){return <Pressable onPress={onPress}><Card><View style={styles.row}><Text style={styles.t}>{event.title}</Text><Text style={styles.g}>{event.activity}</Text></View><Text style={styles.p}>{event.district} · {event.distance} · {event.people}+ personas</Text><Text style={styles.p}>🎵 {event.music.join(' / ')} · S/ {event.price} · {event.friends} amigos</Text></Card></Pressable>}
const styles=StyleSheet.create({row:{flexDirection:'row',justifyContent:'space-between',gap:10},t:{color:colors.text,fontWeight:'900',fontSize:17,flex:1},g:{color:colors.gold,fontWeight:'900'},p:{color:colors.muted,marginTop:7,lineHeight:21}});
