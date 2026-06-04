import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Screen, SectionTitle } from '../components/ui';
import { colors } from '../lib/theme';
export default function Verify18(){return <Screen><View style={styles.c}><Text style={styles.back} onPress={()=>router.back()}>← Volver</Text><Text style={styles.k}>Verificación contextual</Text><Text style={styles.t}>18+ solo cuando corresponde.</Text><Card><SectionTitle title="¿Por qué aparece?" subtitle="Alcohol, promociones sensibles o eventos restringidos."/><Text style={styles.p}>No bloquea el mapa ni eventos generales. UBI puede pedir DNI/carné, consentimiento y selfie opcional en una versión real.</Text></Card><Button label="Simular aprobado" onPress={()=>router.back()}/><Button label="Acceso limitado" variant="ghost" onPress={()=>router.replace('/(tabs)/map')}/></View></Screen>}
const styles=StyleSheet.create({c:{flex:1,padding:20,paddingTop:58,gap:14},back:{color:colors.neonGreen,fontWeight:'900'},k:{color:colors.gold,fontWeight:'900'},t:{color:colors.text,fontSize:35,fontWeight:'900'},p:{color:colors.muted,lineHeight:22}});
