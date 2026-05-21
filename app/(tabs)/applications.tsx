import {
    collection,
    doc,
    getDocs,
    updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../firebase";

export default function Applications() {
  const [apps, setApps] = useState<any[]>([]);

  const fetchApps = async () => {
    let allApps: any[] = [];

    const jobsSnap = await getDocs(collection(db, "jobs"));

    for (let job of jobsSnap.docs) {
      const appsSnap = await getDocs(
        collection(db, "jobs", job.id, "applicants")
      );

      appsSnap.forEach((a) => {
        allApps.push({
          id: a.id,
          jobId: job.id,
          ...a.data(),
        });
      });
    }

    setApps(allApps);
  };

  const updateStatus = async (
    jobId: string,
    appId: string,
    status: string
  ) => {
    await updateDoc(
      doc(db, "jobs", jobId, "applicants", appId),
      { status }
    );

    alert(`Marked as ${status}`);
    fetchApps();
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 25 }}>
        Applicants 📩
      </Text>

      <FlatList
        data={apps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 15,
              marginTop: 10,
              backgroundColor: "#eee",
              borderRadius: 10,
            }}
          >
            <Text>{item.email}</Text>
            <Text>Status: {item.status}</Text>

            <TouchableOpacity
              onPress={() =>
                updateStatus(item.jobId, item.id, "accepted")
              }
              style={{
                backgroundColor: "green",
                padding: 8,
                marginTop: 5,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                Accept
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                updateStatus(item.jobId, item.id, "rejected")
              }
              style={{
                backgroundColor: "red",
                padding: 8,
                marginTop: 5,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>
                Reject
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}