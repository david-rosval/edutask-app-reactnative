import { StyleSheet, Text, View, Modal } from "react-native";
import Svg, { Path } from "react-native-svg";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native";

const HomeEstudiante = () => {
  const usuarioEncontrado = useLocalSearchParams();
  const [estudiante, setEstudiante] = useState({});
  const [tareas, setTareas] = useState([]);
  const [modalUsuario, setModalUsuario] = useState(false);
  const [clase, setClase] = useState({});

  // obtener estudiante
  useEffect(() => {
    const obtenerDatos = async () => {
      const responseEstudiantes = await fetch(
        "https://jairodanielmt-colegiojpc2023.hf.space/estudiantes"
      );
      const estudiantes = await responseEstudiantes.json();
      const estudiante = await estudiantes.find(
        (est) => est.dni === usuarioEncontrado.dni
      );
      setEstudiante(estudiante);
      const responseTareas = await fetch(
        `https://jairodanielmt-colegiojpc2023.hf.space/tareas_estudiante/${estudiante.idestudiante}`
      );
      const tareasEncontradas = await responseTareas.json();
      setTareas(tareasEncontradas);
      const responseClases = await fetch(
        "https://jairodanielmt-colegiojpc2023.hf.space/clases"
      );
      const clases = await responseClases.json();
      const clase = await clases.find(
        (cla) => cla.idclase === estudiante.idclase
      );
      setClase(clase);
    };
    obtenerDatos();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalUsuario(true)}>
        <View>
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-menu-2"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#000000"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <Path d="M4 6l16 0" />
            <Path d="M4 12l16 0" />
            <Path d="M4 18l16 0" />
          </Svg>
        </View>
      </TouchableOpacity>
      <Text style={styles.titulo}>Tus tareas</Text>
      <Text>Buenos días, alumno(a) {estudiante.nombre}</Text>
      <Text style={styles.subtitulo}>Tareas Pendientes</Text>
      <View style={styles.contenedorTareasPendientes}>
        {tareas.length !== 0 ? (
          tareas.map((tarea) =>
            tarea["estado"] === "activo" ? (
              <TouchableOpacity
                key={tarea["idtarea"]}
                onPress={() => console.log(tarea["idtarea"])}
              >
                <View style={styles.containerTarea}>
                  <Text style={styles.textoBlanco}>
                    {tarea["nombre_tarea"]}
                  </Text>
                  <Text style={styles.textoBlanco}>
                    Fecha de entrega: {tarea["fecha_vencimiento"]}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <Text>No tienes tareas pendientes</Text>
            )
          )
        ) : (
          <Text style={styles.textoBlanco}>No Se encontraron tareas</Text>
        )}
      </View>
      <Text style={styles.subtitulo}>Tareas Completadas</Text>
      <View style={styles.contenedorTareasCompletadas}>
        {tareas.length !== 0 ? (
          tareas.map((tarea) =>
            tarea["estado"] === "completado" ? (
              <TouchableOpacity
                onPress={() => console.log("tareas presionada")}
                key={tarea["idtarea"]}
              >
                <View style={styles.containerTarea}>
                  <Text style={styles.textoBlanco}>
                    {tarea["nombre_tarea"]}
                  </Text>
                  <Text style={styles.textoBlanco}>
                    Fecha de entrega: {tarea["fecha_vencimiento"]}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <Text style={styles.textoBlanco}>
                No has completado ninguna tarea
              </Text>
            )
          )
        ) : (
          <Text>No Se encontraron tareas</Text>
        )}
      </View>

      <Modal
        visible={modalUsuario}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalUsuario(false)}
      >
        <View
          style={{
            flex: 1,
            padding: 20,
          }}
        >
          <TouchableOpacity onPress={() => setModalUsuario(false)}>
            <Text>{"< Atras"}</Text>
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-user-circle"
                width="100"
                height="100"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#000000"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <Path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                <Path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                <Path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
              </Svg>
            </View>
            <Text style={styles.textoModal}>Bienvenido:</Text>
            <Text style={styles.textoModal}>{estudiante.nombre}</Text>
            <Text style={styles.textoModal}>DNI: {estudiante.dni}</Text>
            <Text style={styles.textoModal}>Clase: {clase.nombre}</Text>
            <TouchableOpacity
              onPress={() => {
                setModalUsuario(false);
                router.push({
                  pathname: "/",
                });
              }}
              style={styles.botonSalir}
            >
              <Text style={styles.textoBlanco}>Salir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeEstudiante;

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
