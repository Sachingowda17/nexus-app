import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore"; // ✅ changed
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../firebase";

export default function Role() {
  const router = useRouter();

  const setRole = async (role: string) => {
  const user = auth.currentUser;

  if (!user) {
    alert("User not logged in ❌");
    return;
  }

  try {
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role,
    });

    router.replace("/profile?role=" + role);

  } catch (error) {
    console.log(error);
    alert("Error saving role ❌");
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Role</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => setRole("contractor")}
      >
        <Text style={styles.text}>Contractor 👷</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => setRole("worker")}
      >
        <Text style={styles.text}>Worker 👨‍🔧</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 26, textAlign: "center", marginBottom: 30 },
  btn: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  text: { color: "#fff", textAlign: "center", fontSize: 16 },
});