import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";

// 🔥 Firebase
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Profile() {
  const router = useRouter();
  const { role } = useLocalSearchParams(); // worker / contractor

  const [name, setName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [mobile, setMobile] = useState("");
  const [experience, setExperience] = useState("");

  // 🔥 SAVE PROFILE (FIXED VERSION)
  const handleSubmit = async () => {
    if (!name || !jobRole || !mobile) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const uid = auth.currentUser?.uid;

      if (!uid) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      // ✅ SAVE USING UID (VERY IMPORTANT)
      await setDoc(doc(db, "users", uid), {
        name,
        jobRole,
        mobile,
        experience,
        role,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Profile Saved ✅");

      // ✅ Navigate based on role
      if (role === "worker") {
        router.replace("/(tabs)/worker");
      } else {
        router.replace("/(tabs)/contractor");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to save data ❌");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Nexus 🚀</Text>
      <Text style={styles.subtitle}>Create your profile</Text>

      {/* Name */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      {/* Job Role */}
      <Text style={styles.label}>Job Role</Text>
      <TextInput
        style={styles.input}
        placeholder="Painter / Plumber etc"
        value={jobRole}
        onChangeText={setJobRole}
      />

      {/* Mobile */}
      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter mobile number"
        keyboardType="numeric"
        value={mobile}
        onChangeText={setMobile}
      />

      {/* Experience */}
      <Text style={styles.label}>Experience</Text>
      <TextInput
        style={styles.input}
        placeholder="Years of experience"
        value={experience}
        onChangeText={setExperience}
      />

      {/* Upload (optional) */}
      <TouchableOpacity style={styles.uploadBtn}>
        <Text style={styles.uploadText}>Upload Profile Photo</Text>
      </TouchableOpacity>

      {/* Submit */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

// ✅ STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
  },
  uploadBtn: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
  uploadText: {
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});