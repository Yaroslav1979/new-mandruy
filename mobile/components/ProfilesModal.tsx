import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { API_URL } from "@/constants/api";
import * as ImagePicker from "expo-image-picker";

type Props = {
  visible: boolean;
  setVisible: (v: boolean) => void;
};

export function ProfilesModal({ visible, setVisible }: Props) {
  const { user, logout, token } = useAuth();
  const userInitial = user?.name?.[0]?.toUpperCase() || "";

  const [nameModal, setNameModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [avatarModal, setAvatarModal] = useState(false);

  const [newName, setNewName] = useState("");

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [avatar, setAvatar] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    setVisible(false);
    router.replace("/");
  };

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Потрібен доступ до галереї");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0].uri;
      setAvatar(image);
    }
  };

  const changeName = async () => {
    const res = await fetch(`${API_URL}/api/auth/change-name`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newName,
      }),
    });

    await res.json();

    if (res.ok) {
      setNameModal(false);
      alert("Ім'я змінено");
    }
  };

  const changePassword = async () => {
    const res = await fetch(`${API_URL}/api/auth/change-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password,
        newPassword,
      }),
    });

    await res.json();

    if (res.ok) {
      setPasswordModal(false);
      alert("Пароль змінено");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
        <View style={styles.modalContent}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarBig} />
          ) : (
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarLetter}>{userInitial}</Text>
            </View>
          )}

          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>

          <Pressable
            style={styles.optionBtn}
            onPress={() => setNameModal(true)}
          >
            <Text>Змінити імʼя</Text>
          </Pressable>

          <Pressable
            style={styles.optionBtn}
            onPress={() => setPasswordModal(true)}
          >
            <Text>Змінити пароль</Text>
          </Pressable>

          <Pressable
            style={styles.optionBtn}
            onPress={() => setAvatarModal(true)}
          >
            <Text>Змінити аватар</Text>
          </Pressable>

          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Вийти</Text>
          </Pressable>
        </View>
      </Pressable>

      {/* Модалка встановлення та зміни аватара */}

      <Modal visible={avatarModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Pressable style={styles.button} onPress={pickAvatar}>
              <Text>Вибрати фото</Text>
            </Pressable>

            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatarBig} />
            ) : (
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarLetter}>{userInitial}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Модалка зміни імені */}

      <Modal visible={nameModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>Нове імʼя</Text>

            <TextInput
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
            />

            <Pressable style={styles.button} onPress={changeName}>
              <Text>Зберегти</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Модалка зміни паролю */}

      <Modal visible={passwordModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Поточний пароль"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TextInput
              placeholder="Новий пароль"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <Pressable style={styles.button} onPress={changePassword}>
              <Text>Змінити пароль</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000090",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    gap: 10,
  },

  avatarBig: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  name: {
    fontSize: 20,
    fontWeight: "600",
  },

  email: {
    fontSize: 16,
    color: "#666",
  },

  logoutBtn: {
    marginTop: 10,
    backgroundColor: "#9370db",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
  },

  optionBtn: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    width: "100%",
    alignItems: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    width: "100%",
  },

  button: {
    marginTop: 10,
    backgroundColor: "#9370db",
    padding: 10,
    borderRadius: 8,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarLetter: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
});
