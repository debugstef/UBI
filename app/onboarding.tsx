import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Chip, Screen, SectionTitle } from '../components/ui';
import { colors } from '../lib/theme';

export default function Onboarding() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.kicker}>Onboarding corto</Text>
        <Text style={styles.title}>Primero mapa. Luego personalización.</Text>
        <Text style={styles.copy}>Configura lo mínimo: perfil, edad declarada, preferencias y ubicación. La verificación 18+ solo aparece si intentas ver alcohol o eventos restringidos.</Text>
        <Card><SectionTitle title="Perfil inicial" subtitle="@ubi_user · Lima · visitante limitado disponible" /><Text style={styles.note}>Puedes completar foto, bio y universidad después.</Text></Card>
        <SectionTitle title="Preferencias" subtitle="Usadas para ordenar hotspots, no para bloquear el mapa." />
        <View style={styles.chips}>{['Miraflores','Barranco','San Isidro','Surco','La Molina','Reggaetón','House','Techno','Previa','Reu','Rooftop','After'].map((x,i)=><Chip key={x} label={x} active={i<6}/>)}</View>
        <Card>
          <SectionTitle title="Ubicación" subtitle="Elige una rama del flujo." />
          <View style={styles.actions}>
            <Button label="Aceptar aproximada" onPress={() => router.replace('/(tabs)/map')} />
            <Button label="Aceptar precisa" variant="ghost" onPress={() => router.replace('/(tabs)/map')} />
            <Button label="Elegir zona manual" variant="ghost" onPress={() => router.replace('/(tabs)/map')} />
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}
const styles = StyleSheet.create({ container:{padding:20,paddingTop:62,paddingBottom:120,gap:14}, kicker:{color:colors.gold,fontWeight:'900'}, title:{color:colors.text,fontSize:35,fontWeight:'900',lineHeight:39}, copy:{color:colors.muted,lineHeight:22}, note:{color:colors.muted,lineHeight:20}, chips:{flexDirection:'row',flexWrap:'wrap',gap:10}, actions:{gap:10,marginTop:10} });
