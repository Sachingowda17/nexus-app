import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";

// ✅ TYPE
type Application = {
  id: string;
  workerName: string;
  jobTitle: string;
  status: string;
  contractorId: string;
};

export default function Contractor() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);

  // 🔥 POST JOB (WITH contractorId)
  const handlePostJob = async () => {
    if (!title || !description) {
      alert("Fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, "jobs"), {
        title,
        description,
        contractorId: auth.currentUser?.uid, // ⭐ IMPORTANT
        createdAt: new Date(),
      });

      alert("Job posted ✅");
      setTitle("");
      setDescription("");
    } catch (error) {
      console.log(error);
      alert("Error posting job ❌");
    }
  };

  // 🔥 FETCH ONLY MY APPLICATIONS
  const fetchApplications = async () => {
    try {
      const snapshot = await getDocs(collection(db, "applications"));
      const currentUser = auth.currentUser?.uid;

      const list: Application[] = snapshot.docs
        .map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Application, "id">),
        }))
        .filter((item: any) => item.contractorId === currentUser); // ⭐ FILTER

      setApplications(list);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // 🔥 ACCEPT / REJECT
  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "applications", id), {
        status,
      });
      fetchApplications();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contractor Dashboard 👷‍♂️</Text>

      {/* 🔹 JOB FORM */}
      <TextInput
        placeholder="Job Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Description"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.postBtn} onPress={handlePostJob}>
        <Text style={styles.postText}>Post Job</Text>
      </TouchableOpacity>

      {/* 🔹 APPLICATIONS */}
      <Text style={styles.subtitle}>Applicants 📄</Text>

      {applications.length === 0 ? (
        <Text style={{ textAlign: "center", color: "gray" }}>
          No applicants yet
        </Text>
      ) : (
        <FlatList
          data={applications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>
                {item.workerName || "No Name"}
              </Text>

              <Text>{item.jobTitle || "No Job Title"}</Text>

              <Text>Status: {item.status}</Text>

              {item.status === "pending" && (
                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.accept}
                    onPress={() => updateStatus(item.id, "accepted")}
                  >
                    <Text style={styles.btnText}>Accept</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.reject}
                    onPress={() => updateStatus(item.id, "rejected")}
                  >
                    <Text style={styles.btnText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      )}
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  postBtn: {
    backgroundColor: "green",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },

  postText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  name: {
    fontWeight: "bold",
    fontSize: 16,
  },

  row: {
    flexDirection: "row",
    marginTop: 10,
  },

  accept: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },

  reject: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
  },

  btnText: {
    color: "#fff",
  },
});