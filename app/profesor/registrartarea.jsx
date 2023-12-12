import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";

const RegistrarNuevaTarea = () => {
  const {clase, estudiantes} = useLocalSearchParams();

  const [nombreTarea, setNombreTarea] = useState("");
  const [instrucciones, setInstrucciones] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");

  handleAgregarTarea = () => {
    const registrarTarea = async () => {
      const response = await fetch(
        "https://jairodanielmt-colegiojpc2023.hf.space/tareas/comun",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "nombre_tarea": nombreTarea,
            "instrucciones": instrucciones,
            "fecha_vencimiento": fechaVencimiento,
            "idclase": clase["idclase"],
            "estado": "activo",
          }),
        }
      );
      const data = await response.json();
      console.log(data);
    };
    registrarTarea();
    router.push({
      pathname: "/profesor/tareasporclase",
      params: clase,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{estudiantes[0]["nombre"]}</Text>
      <Text style={styles.clase}>Clase: {clase["nombre"]}</Text>
      <TextInput
        style={styles.input}
        placeholder="nombre de tarea"
        onChangeText={(text) => setNombreTarea(text)}
        value={nombreTarea}
      />
      <TextInput
        style={styles.input}
        placeholder="instrucciones"
        onChangeText={(text) => setInstrucciones(text)}
        value={instrucciones}
      />
      <TextInput
        style={styles.input}
        placeholder="fecha de vencimiento"
        onChangeText={(text) => setFechaVencimiento(text)}
        value={fechaVencimiento}
      />
      <TouchableOpacity style={styles.button} onPress={handleAgregarTarea}>
        <Text style={styles.buttonText}>Agregar Tarea</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegistrarNuevaTarea;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  clase: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
