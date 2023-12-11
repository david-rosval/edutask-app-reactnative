import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';

const TareasPorClase = () => {

    const clase = useLocalSearchParams();
  return (
    <View>
      <Text>{clase["nombre"]}</Text>
    </View>
  )
}

export default TareasPorClase

const styles = StyleSheet.create({})