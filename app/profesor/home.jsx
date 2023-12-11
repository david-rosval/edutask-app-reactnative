import { Modal, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native";

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
    <View>
      <TouchableOpacity onPress={() => setModalUsuario(true)}>
        <Text>Usuario</Text>
      </TouchableOpacity>
      <Text>HomeProfesor</Text>
      <Text>Buenos días, profesor(a) {profesor.nombre}</Text>
      <Text>Clases</Text>
      <View>
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
              <View>
                <Text>{clase["nombre"]}</Text>
                <Text>Tareas asignadas: {tareasProfesor.length}</Text>
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
        <View>
          <TouchableOpacity onPress={() => setModalUsuario(false)}>
            <Text>Atras</Text>
          </TouchableOpacity>
          <Text>logo usuario</Text>
          <Text>Bienvenido:</Text>
          <Text>{profesor.nombre}</Text>
          <Text>DNI: {profesor.dni}</Text>
          <Text>Correo institucional:</Text>
          <Text>{profesor["correo"]}</Text>
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

export default HomeProfesor;

const styles = StyleSheet.create({});
