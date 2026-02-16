import ParallaxScrollView from '@/components/parallax-scroll-view';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  return (
    <ParallaxScrollView
          headerBackgroundColor={{ light: '#fff', dark: '#1D3D47' }}
          headerHeight={50}
          headerImage={<View />}
      >
         
      <View style={styles.pageTitle}>
        <Text style={styles.title}>Login page</Text>
      </View>

      <View style={styles.form}>

        <View style={styles.formBlock}>
         <Text style={styles.label}>Електронна пошта / Email:</Text>
         <TextInput style={styles.input} textAlign='center' />
        </View>
        <View style={styles.formBlock}>
          <Text style={styles.label}>Пароль / Password:</Text>
         <TextInput style={styles.input} textAlign='center' secureTextEntry={true}/>
        </View>
        <TouchableOpacity style={styles.btn} >
          <Text style={styles.btnTxt}> Вхід </Text> 
        </TouchableOpacity>

      </View>

     </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    backgroundColor: "#000",
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Ukrainian-Bold',
    color: "#eee"
  },

    form: {
      fontFamily: 'Ukrainian-Bold',
      display: "flex",
      gap: 40,
      marginTop: 100,
      marginHorizontal: 40,
    },
    formBlock: {
      display: "flex",
      gap: 10
    },
     label: {
      fontFamily: 'Ukrainian-Regular',
      color: "#111",
      fontSize: 20,

    },
    input: {
      borderWidth: 2,
      borderColor: "#111",
      height: 60,
      borderRadius: 30,
      fontSize: 20,
      fontFamily: 'Ukrainian-Regular',
      color: "#111",
    },
    btn: {
      backgroundColor: '#9370db99',
      borderWidth: 2,
      height: 60,
      borderRadius: 30,
      alignItems: "center",
      justifyContent: "center"
    },
    btnTxt: {
      fontFamily: 'Ukrainian-Regular',
      color: "#eee",
      fontSize: 20
    }
})