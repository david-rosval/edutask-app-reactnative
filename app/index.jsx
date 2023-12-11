import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";

const LoginPage = () => {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [todosUsuarios, setTodosUsuarios] = useState([]);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      const response = await fetch(
        "https://jairodanielmt-colegiojpc2023.hf.space/usuarios"
      );
      const data = await response.json();
      setTodosUsuarios(data);
    }
    obtenerUsuarios()
  }, []);

  const handleBtnIngresar = () => {
    const usuarioEncontrado = todosUsuarios.find(
        (user) => user.dni === usuario && user.contrasena === clave
    )
    console.log(usuarioEncontrado);
    if (usuarioEncontrado.rol === "estudiante") {
        router.push({
            pathname: "estudiante/home",
            params: usuarioEncontrado ,
        })
    } else if (usuarioEncontrado.rol === "profesor") {
        router.push({
            pathname: "profesor/home",
            params: usuarioEncontrado,
        })
    } else console.log("no se encontro el usuario");
  }

  return (
    <View style={ styles.container }>
      <Text>Iniciar Sesión</Text>
      <TextInput
        placeholder="usuario"
        value={usuario}
        onChangeText={(text) => setUsuario(text)}
        style={styles.inputs}
      />
      <TextInput
        placeholder="contraseña"
        secureTextEntry
        value={clave}
        onChangeText={(text) => setClave(text)}
        style={styles.inputs}
      />
      <TouchableOpacity
        onPress={handleBtnIngresar}
        style={styles.buttonIngresar}
      >
        <Text style={styles.textoBoton} >Ingresar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputs: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  buttonIngresar: {
    width: "80%",
    height: 40,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  textoBoton: {
    color: "white",
    uppercase: true,
  }
});
