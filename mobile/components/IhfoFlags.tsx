import { useState } from "react";
import Group14 from "../assets/svg/Group14.svg";
import Group15 from "../assets/svg/Group15.svg";
import Group16 from "../assets/svg/Group16.svg";

import {
  Pressable,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  Modal,
  Text,
} from "react-native";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
};

type ModalContent = {
  title: string;
  description: string;
};

export function InfoFlags({ containerStyle }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [content, setContent] = useState<ModalContent | null>(null);

  const openModal = (data: ModalContent) => {
    setContent(data);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <View style={[styles.wrapperIcons, containerStyle]}>
        <Pressable
          onPress={() =>
            openModal({
              title: "Різноманіття",
              description:
                "В нашій базі можна знайти місця для таборів або недовготривалих мандрівок, визначні історичні пам’ятки, річки чи озера.",
            })
          }
        >
          <Group14 style={styles.icon} />
        </Pressable>

        <Pressable
          onPress={() =>
            openModal({
              title: "Сортування",
              description:
                "Усі місця чи пам’ятки відсортовані за категоріями. Ви можете легко знайти те, що вам потрібно, задавши певні параметри пошуку.",
            })
          }
        >
          <Group15 style={styles.icon} />
        </Pressable>

        <Pressable
          onPress={() =>
            openModal({
              title: "Інтерактивна мапа",
              description:
                "Кожне місце також можна переглянути на Google Мапах, що додає зручності для прокладання маршрутів.",
            })
          }
        >
          <Group16 style={styles.icon} />
        </Pressable>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.overlay} onPress={closeModal}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>{content?.title}</Text>
            <Text style={styles.description}>{content?.description}</Text>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapperIcons: {
    flexDirection: "row",
    gap: 100,
    marginBottom: 30,
  },
  icon: {
    width: 60,
    height: 60,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
});
