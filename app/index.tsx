import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Index() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ REGISTER
  const register = async () => {
    if (!email || !password) {
      alert("Enter email & password");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Save user in Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        email,
        role: null,
      });

      alert("Registered ✅");

      // Go to role selection
      router.replace("/role");
    } catch (e: any) {
      alert(e.message);
    }
  };

  // ✅ LOGIN
  const login = async () => {
    if (!email || !password) {
      alert("Enter email & password");
      return;
    }

    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userRef = doc(db, "users", userCred.user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists() && snap.data().role) {
        const role = snap.data().role;

        // 🔥 Role-based navigation
        if (role === "worker") {
          router.replace("/(tabs)/worker");
        } else {
          router.replace("/(tabs)/contractor");
        }
      } else {
        router.replace("/role");
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nexus App 🚀</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.reg} onPress={register}>
        <Text style={styles.text}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.log} onPress={login}>
        <Text style={styles.text}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  reg: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  log: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 10,
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});