import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UbiEvent } from '../lib/types';
import { colors, gradients } from '../lib/theme';
export function StoryStrip({event}:{event:UbiEvent}){return <View style={styles.row}>{['🔥','🎵','👥'].map((x,i)=><LinearGradient key={x} colors={gradients.story} style={styles.s}><Text style={styles.e}>{x}</Text><Text style={styles.m}>{event.lastStory+i*3}m</Text></LinearGradient>)}</View>}
const styles=StyleSheet.create({row:{flexDirection:'row',gap:10,marginTop:16},s:{flex:1,height:112,borderRadius:22,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.borderGold},e:{fontSize:28},m:{color:colors.champagne,fontWeight:'900',marginTop:8}});
