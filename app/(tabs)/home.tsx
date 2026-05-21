import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function Home() {
  const [role, setRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    getUserRole();
  }, []);

  const getUserRole = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));
    setRole(snap.data()?.role);
  };

  const logout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome 🚀</Text>

      {role === "contractor" && (
        <TouchableOpacity style={styles.btn} onPress={() => router.push("/add-job")}>
          <Text style={styles.btnText}>Post Job</Text>
        </TouchableOpacity>
      )}

      {role === "worker" && (
        <TouchableOpacity style={styles.btn} onPress={() => router.push("/jobs")}>
          <Text style={styles.btnText}>View Jobs</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.btnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 22 },
  btn: {
    marginTop: 20,
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 10,
  },
  logout: {
    marginTop: 20,
    backgroundColor: "red",
    padding: 12,
    borderRadius: 10,
  },
  btnText: { color: "#fff" },
});