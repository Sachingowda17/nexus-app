import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../firebase";

export default function Worker() {
  const [jobs, setJobs] = useState([]);

  // 🔹 Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      const snapshot = await getDocs(collection(db, "jobs"));
      const jobList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobList);
    };

    fetchJobs();
  }, []);

  // 🔥 APPLY FUNCTION (FIXED)
  const handleApply = async (job) => {
    try {
      await addDoc(collection(db, "applications"), {
        jobId: job.id,
        jobTitle: job.title || "No Title",
        workerName: "Sachin", // later dynamic
        workerId: "user123", // optional
        status: "pending",
        createdAt: new Date(),
      });

      alert("Applied successfully ✅");
    } catch (error) {
      console.log(error);
      alert("Error applying ❌");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Worker Dashboard 👷</Text>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.job}>{item.title}</Text>
            <Text>{item.description}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleApply(item)}
            >
              <Text style={styles.btnText}>Apply</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  job: {
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    marginTop: 10,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
  },
});