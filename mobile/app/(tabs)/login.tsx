import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import { BurgerMenu } from '../../components/burger-menu';

export default function LoginScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  return (
    
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#fff', dark: '#1D3D47' }}
      headerHeight={35}
      headerImage={<View />}
      
    >
        <View style={styles.pageTitle}>
           <BurgerMenu />
          <Image
            source={require('@/assets/svg/logo.svg')}
            style={styles.logo}
         />
         
      </View>
      
      <View style={{ position: "relative" }}>
        <Image 
          source={require('../../assets/images/NightMoon.jpg')}
          style={styles.bgd}
        />
      </View>

     <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ 
                flex: 1, 
                position: 'absolute', 
                left: 0, 
                right: 0, 
                alignItems: 'center'
              }}
      >
    
        <View style={[styles.form, isLandscape && styles.formLandscape]}>
        
          <View style={[styles.formWrapper, isLandscape && styles.formWrapperLandscape]}>
            
            <View style={[styles.formBlock, isLandscape && styles.formBlockLandscape]}>
              <Text style={styles.label}>Електронна пошта / Email:</Text>
              <TextInput 
                style={styles.input} 
                textAlign='center'
                autoFocus={false}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                />
                <Pressable
                  onPress={() => router.push('/registr')}
                >
                  <Text style={styles.text} >Не зареєстровані? Реєстрація</Text> 
                </Pressable>
            </View>

            <View style={styles.formBlock}>
              <Text style={styles.label}>Пароль / Password:</Text>
              <TextInput 
                style={styles.input}
                textAlign='center'
                secureTextEntry={true}
                autoFocus={false}
                textContentType="password"
              />
              <Pressable>
                <Text style={styles.text}>Забули пароль?</Text>
              </Pressable>
          </View>
        </View>

          <TouchableOpacity style={styles.btn} >
            <Text style={styles.btnTxt}> Вхід </Text> 
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
     </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
   bgd: {
    flex: 1,
    height: 800,
  },

  pageTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: "#111",
    padding: 10,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Ukrainian-Bold',
    color: "#eee"
  },
    logo: {
    width: 150,
    height: 35,
  },
    form: { 
      fontFamily: 'Ukrainian-Bold',
      display: "flex",
      maxWidth: 500, 
      top: 150, 
    },

    formLandscape: {
      fontFamily: 'Ukrainian-Bold',
      display: "flex",
      gap: 20,
      width: '100%',
       maxWidth: 700,
       top: 80,
    },
    formWrapper: {
      display: "flex",
      flexDirection: "column"
    },
  formWrapperLandscape: {
      display: "flex",
    flexDirection: "row",
    gap: 20
  },

  formBlock: {
    flex: 1,
    gap: 10,
  },

    formBlockLandscape: {
      display: "flex",
      flex: 1,
      width: 200,
      gap: 10,
    },

     label: {
      fontFamily: 'Ukrainian-Regular',
      color: "#eee",
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
      backgroundColor: "#eeeeee90"
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
    },
    text: {
      fontFamily: 'Ukrainian-Regular',
      color: "#eee",
      fontSize: 12
    }
})