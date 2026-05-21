import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function AddJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const postJob = async () => {
    if (!title || !description) {
      alert("Fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "jobs"), {
        title,
        description, // ✅ FIXED
        createdBy: auth.currentUser?.uid || "unknown",
        createdAt: new Date(),
      });

      alert("Job Posted ✅");
      setTitle("");
      setDescription("");
    } catch (error) {
      console.log(error);
      alert("Error posting job ❌");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post Job</Text>

      <TextInput
        placeholder="Job Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Job Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <TouchableOpacity style={styles.btn} onPress={postJob}>
        <Text style={styles.text}>Post Job</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
  },
  btn: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
  },
  text: { color: "#fff", textAlign: "center" },
});