import { StyleSheet, Text, View, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native";

const HomeEstudiante = () => {
  const usuarioEncontrado = useLocalSearchParams();
  const [estudiante, setEstudiante] = useState({});
  const [tareas, setTareas] = useState([]);
  const [modalUsuario, setModalUsuario] = useState(false);
  const [clase, setClase] = useState({})

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
      setClase(clase)
    };
    obtenerDatos();
  }, []);

  return (
    <View>
      <TouchableOpacity onPress={() => setModalUsuario(true)}>
        <Text>Usuario</Text>
      </TouchableOpacity>
      <Text>Tus tareas</Text>
      <Text>Buenos días, alumno {estudiante.nombre}</Text>
      <Text>Tareas Pendientes</Text>
      <View>
        {tareas.length !== 0 ? (
          tareas.map((tarea) =>
            tarea["estado"] === "activo" ? (
              <TouchableOpacity
                key={tarea["idtarea"]}
                onPress={() => console.log(tarea["idtarea"])}
              >
                <View>
                  <Text>{tarea["nombre_tarea"]}</Text>
                  <Text>Fecha de entrega: {tarea["fecha_vencimiento"]}</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <Text>No tienes tareas pendientes</Text>
            )
          )
        ) : (
          <Text>No Se encontraron tareas</Text>
        )}
      </View>
      <Text>Tareas Completadas</Text>
      <View>
        {tareas.length !== 0 ? (
          tareas.map((tarea) =>
            tarea["estado"] === "completado" ? (
              <TouchableOpacity
                onPress={() => console.log("tareas presionada")}
                key={tarea["idtarea"]}
              >
                <View>
                  <Text>{tarea["nombre_tarea"]}</Text>
                  <Text>Fecha de entrega: {tarea["fecha_vencimiento"]}</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <Text>No has completado ninguna tarea</Text>
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
        <View>
          <TouchableOpacity onPress={() => setModalUsuario(false)}>
            <Text>Atras</Text>
          </TouchableOpacity>
          <Text>logo usuario</Text>
          <Text>Bienvenido:</Text>
          <Text>{estudiante.nombre}</Text>
          <Text>DNI: {estudiante.dni}</Text>
          <Text>Clase: {clase.nombre}</Text>
          <TouchableOpacity
            onPress={() => {
              setModalUsuario(false);
              router.push({
                pathname: "/",
              });
            }}
          >
            <Text>Salir</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default HomeEstudiante;

const styles = StyleSheet.create({});
