import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import Svg, { Path } from "react-native-svg";

const TareasPorClase = () => {
  const clase = useLocalSearchParams();
  const [tareasporclase, setTareasporclase] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [tareasInfo, setTareasInfo] = useState([]);
  const [tarea, setTarea] = useState("");
  const [modalEstudiantesTarea, setModalEstudiantesTarea] = useState(false);

  useEffect(() => {
    const procesarTareasClase = async () => {
      const response = await fetch(
        `https://jairodanielmt-colegiojpc2023.hf.space/tareas_clase/${clase["idclase"]}`
      );
      const data = await response.json();
      //console.log(data);
      setTareasporclase(data);

      const nombresUnicos = {};
      data.forEach((tarea) => {
        const nombreTarea = tarea["nombre_tarea"];
        const fecha = tarea["fecha_vencimiento"];

        // Si el nombre ya existe en el objeto nombresUnicos, incrementa la frecuencia
        if (nombresUnicos[nombreTarea]) {
          nombresUnicos[nombreTarea].cantidad++;
        } else {
          // Si el nombre no existe, crea una entrada para él
          nombresUnicos[nombreTarea] = {
            cantidad: 1,
            fechaVencimiento: fecha,
          };
        }
      });

      // Convertir el objeto nombresUnicos en un arreglo de objetos
      const nombresUnicosArray = Object.keys(nombresUnicos).map(
        (nombreTarea) => ({
          nombreTarea: nombreTarea,
          cantidadAsignados: nombresUnicos[nombreTarea].cantidad,
          fechaVencimiento: nombresUnicos[nombreTarea].fechaVencimiento,
        })
      );

      // Guardar el resultado en el estado
      setTareasInfo(nombresUnicosArray);

      const responseEstudiantes = await fetch(
        "https://jairodanielmt-colegiojpc2023.hf.space/estudiantes"
      );
      const students = await responseEstudiantes.json();
      setEstudiantes(students);

      console.log(students);
      console.log(data);
    };
    procesarTareasClase();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <Text style={styles.textoModal}>{"< Atras"}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.titulo}>{clase["nombre"]}</Text>
      <ScrollView>
        {tareasInfo.map((tarea) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setModalEstudiantesTarea(true);
                setTarea(tarea.nombreTarea);
              }}
            >
              <View style={styles.containerTarea}>
                <Text style={styles.textoTituloTarea}>{tarea.nombreTarea}</Text>
                <Text style={styles.textoBlanco}>
                  Asignado a {tarea.cantidadAsignados} estudiantes
                </Text>
                <Text style={styles.textoBlanco}>
                  Fecha de entrega: {tarea.fechaVencimiento}
                </Text>
              </View>
            </TouchableOpacity>
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
          onPress={() =>
            router.push({
              pathname: "/profesor/registrartarea",
              params: clase
            })
          }
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

      {modalEstudiantesTarea && (
        <Modal
          visible={modalEstudiantesTarea}
          animationType="slide"
          transparent={false}
          onRequestClose={() => {
            setModalEstudiantesTarea(false);
            setTarea("");
          }}
        >
          <View
            style={{
              padding: 20,
              flex: 1,
            }}
          >
            <View>
              <TouchableOpacity
                onPress={() => {
                  setModalEstudiantesTarea(false);
                  setTarea("");
                }}
              >
                <Text style={styles.textoModal}>{"< Atras"}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.titulo}>Entregas</Text>
            <ScrollView>
              {tareasporclase.map((hw) => {
                if (hw["nombre_tarea"] === tarea) {
                  return (
                    <View
                      style={{
                        backgroundColor: "#eeeeee",
                        borderRadius: 10,
                        padding: 10,
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: "black",
                          fontSize: 16,
                        }}
                      >
                        {
                          estudiantes.find(
                            (e) => e.idestudiante === hw.idestudiante
                          ).nombre
                        }
                      </Text>
                      <Text
                        style={{
                          color: "black",
                          textAlign: "right",
                          fontStyle: "italic",
                        }}
                      >
                        {hw.estado === "activo" ? "Pendiente" : "Completado"}
                      </Text>
                    </View>
                  );
                }
              })}
            </ScrollView>
          </View>
        </Modal>
      )}
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
    marginBottom: 10,
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
