import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { UbiEvent, UbiStore } from '../lib/types';
import { colors } from '../lib/theme';
export function LiveMap({events,stores,onEventPress}:{events:UbiEvent[];stores:UbiStore[];onEventPress?:(id:string)=>void}){if(Platform.OS==='web'){return React.createElement('iframe',{src:'https://www.openstreetmap.org/export/embed.html?bbox=-77.08%2C-12.18%2C-76.98%2C-12.07&layer=mapnik',style:{border:0,width:'100%',height:'100%',filter:'brightness(0.55) saturate(1.25) hue-rotate(70deg) contrast(1.1)'}})}return <View style={styles.fallback}><Text style={styles.osm}>OpenStreetMap preview</Text></View>}
export function MapOverlay({events,stores,onEventPress}:{events:UbiEvent[];stores:UbiStore[];onEventPress?:(id:string)=>void}){return null}
const styles=StyleSheet.create({fallback:{flex:1,backgroundColor:colors.surface,alignItems:'center',justifyContent:'center'},osm:{color:colors.muted,fontWeight:'900'}});
