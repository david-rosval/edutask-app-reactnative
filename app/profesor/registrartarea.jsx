import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";

const RegistrarTarea = () => {
  const clase = useLocalSearchParams();

  const [estudiantes, setEstudiantes] = useState([]);
  const [nombreTarea, setNombreTarea] = useState("");
  const [instrucciones, setInstrucciones] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");

  useEffect(() => {
    console.log(clase);
    const procesarEstudiantes = async () => {
      const responseEstudiantes = await fetch(
        "https://jairodanielmt-colegiojpc2023.hf.space/estudiantes"
      );
      const students = await responseEstudiantes.json();
      console.log(students);
      setEstudiantes(students);
    };
    procesarEstudiantes();
  }, []);

  const registrarTarea = async (nuevaTarea) => {
    const responseRegistro = await fetch(
      "https://jairodanielmt-colegiojpc2023.hf.space/tareas",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaTarea),
      }
    );
    const data = await responseRegistro.json();
    console.log(data);
  };

  handleAgregarTarea = async () => {
    console.log("agregar tarea");
    console.log(clase["idclase"]);

    // validación de campos vacíos
    if (nombreTarea === "" || instrucciones === "" || fechaVencimiento === "" ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    estudiantes.forEach(async (est) => {
      console.log(est);

      const nuevaTarea = {
        "nombre_tarea": nombreTarea,
        "instrucciones": instrucciones,
        "fecha_vencimiento": fechaVencimiento,
        "idclase": clase["idclase"],
        "idestudiante": est["idestudiante"],
        "estado": "activo",
      };
      est["idclase"] === parseInt(clase["idclase"]) && await registrarTarea(nuevaTarea);
    });

    alert("Tarea registrada exitosamente");
    router.back();
  };

  return (
    <View style={styles.container}>
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

export default RegistrarTarea;

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
