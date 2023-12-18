import { Modal, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";

const HomeProfesor = () => {
  const usuarioEncontrado = useLocalSearchParams();
  const [profesor, setProfesor] = useState({});
  const [clases, setClases] = useState([]);
  const [tareasProfesor, setTareasProfesor] = useState([]);
  const [modalUsuario, setModalUsuario] = useState(false);

  useEffect(() => {
    const obtenerProfesor = async () => {
      const responseProfesores = await fetch(
        "https://jairodanielmt-colegiojpc2023.hf.space/profesores"
      );
      const profesores = await responseProfesores.json();
      const profe = await profesores.find(
        (pro) => pro.dni === usuarioEncontrado.dni
      );
      setProfesor(profe);
      const responseClases = await fetch(
        "https://jairodanielmt-colegiojpc2023.hf.space/clases"
      );
      const clases = await responseClases.json();
      const clasesEncontradas = await clases.filter(
        (cla) => cla.idprofesor === profe.idprofesor
      );
      setClases(clasesEncontradas);
      const responseTareas = await fetch(
        `https://jairodanielmt-colegiojpc2023.hf.space/tareas_profesor/${profe.idprofesor}`
      );
      const tareas = await responseTareas.json();
      setTareasProfesor(tareas);
    };
    obtenerProfesor();
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
      <Text style={styles.titulo}>Gestor de tareas</Text>
      <Text>Buenos días, profesor(a) {profesor.nombre}</Text>
      <Text style={styles.subtitulo}>Clases</Text>
      <View style={styles.contenedorTareasPendientes}>
        {clases.length !== 0 ? (
          clases.map((clase) => (
            <TouchableOpacity
              key={clase["idclase"]}
              onPress={() => {
                router.push({
                  pathname: "profesor/tareasporclase",
                  params: clase,
                });
              }}
            >
              <View style={styles.containerTarea}>
                <Text style={styles.textoBlanco}>{clase["nombre"]}</Text>
                <Text style={styles.textoBlanco}>
                  Tareas asignadas: {tareasProfesor.length}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text>No se encontraron clases</Text>
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
            <Text style={styles.textoModal}>Prof. {profesor.nombre}</Text>
            <Text style={styles.textoModal}>DNI: {profesor.dni}</Text>
            <Text style={styles.textoModal}>Correo institucional:</Text>
            <Text style={styles.textoModal}>{profesor["correo"]}</Text>
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

export default HomeProfesor;

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
