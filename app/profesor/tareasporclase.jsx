import { StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import Svg, { Path } from "react-native-svg";

const TareasPorClase = () => {
  const clase = useLocalSearchParams();
  const [tareasporclase, setTareasporclase] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);

  useEffect(() => {
    const procesarTareasClase = async () => {
      const response = await fetch(
        `https://jairodanielmt-colegiojpc2023.hf.space/tareas_clase/${clase["idclase"]}`
      );
      const data = await response.json();
      //console.log(data);
      setTareasporclase(data);
      const responseEstudiantes = await fetch(
        "https://jairodanielmt-colegiojpc2023.hf.space/estudiantes"
      );
      const students = await responseEstudiantes.json();
      setEstudiantes(students);

      console.log(estudiantes);
      console.log(tareasporclase);
    };
    procesarTareasClase();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{clase["nombre"]}</Text>
      <ScrollView>
        {tareasporclase.map((tarea) => {
          const estudiante = estudiantes.find(
            (est) => est["idestudiante"] === tarea["idestudiante"]
          );
          const nombreEstudiante = estudiante ? estudiante.nombre : "";
          const estadoTarea =
            tarea["estado"] === "activo" ? "pendiente" : "completado";

          return (
            <View
              style={
                estadoTarea === "pendiente"
                  ? styles.contenedorTareasPendientes
                  : styles.contenedorTareasCompletadas
              }
              key={tarea["idtarea"]}
            >
              <View style={styles.containerTarea}>
                <Text style={styles.textoTituloTarea}>
                  {tarea["nombre_tarea"]}
                </Text>
                <Text style={styles.textoBlanco}>
                  Asignado a: {nombreEstudiante}
                </Text>
                <Text style={styles.textoBlanco}>
                  Fecha de entrega: {tarea["fecha_vencimiento"]}
                </Text>
                <Text style={styles.textoBlanco}>Estado: {estadoTarea}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View
        style={{
          width: "100%",
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          style={{
            borderRadius: 50,
            backgroundColor: "#00b341",
            padding: 5,
          }}
          onPress={() => router.push({
            pathname: "/profesor/registrartarea",
            params: {
              clase: clase,
              estudiantes: estudiantes
            }
          })}
        >
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-plus"
            width="50"
            height="50"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="#ffffff"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <Path d="M12 5l0 14" />
            <Path d="M5 12l14 0" />
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TareasPorClase;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  contenedorTareasPendientes: {
    width: "100%",
    // esquinas redondeadas
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#0000ab",
    marginBottom: 10,
  },
  contenedorTareasCompletadas: {
    width: "100%",
    // esquinas redondeadas
    borderRadius: 10,
    padding: 10,

    backgroundColor: "#006400",
  },
  textoBlanco: {
    color: "white",
  },
  textoTituloTarea: {
    color: "white",
    fontWeight: "bold",
  },
  containerTarea: {
    backgroundColor: "#0000ff",
    borderRadius: 10,
    padding: 10,
  },
  textoModal: {
    marginVertical: 10,
  },
  botonSalir: {
    marginTop: 50,
    width: "50%",
    height: 40,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
