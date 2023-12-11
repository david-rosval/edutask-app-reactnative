import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';

const TareasPorClase = () => {

    const clase = useLocalSearchParams();
    const [tareasporclase, setTareasporclase] = useState([])
    const [estudiantes, setEstudiantes] = useState([])

  useEffect(() => {
    const procesarTareasClase = async () => {
      const response = await fetch(
        `https://jairodanielmt-colegiojpc2023.hf.space/tareas_clase/${clase["idclase"]}`
      )
      const data = await response.json()
      console.log(data);
      setTareasporclase(data)
      const responseEstudiantes = await fetch(
        "https://jairodanielmt-colegiojpc2023.hf.space/estudiantes"
      )
      const students = await responseEstudiantes.json()
      setEstudiantes(students) 
    }
    procesarTareasClase()
  }, [])

  return (
    <View>
      <Text>{clase["nombre"]}</Text>
      <ScrollView>
        {tareasporclase.map((tarea) => {
          return (
            <View key={tarea["idtarea"]}>
              <Text>{tarea["nombre_tarea"]}</Text>
              <Text>Asignado a: {estudiantes.find(est => est["idestudiante"] === tarea["idestudiante"]).nombre}</Text>
              <Text>{tarea["fecha_vencimiento"]}</Text>
              <Text>Asignación: {tarea["estado"]}</Text>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

export default TareasPorClase

const styles = StyleSheet.create({})