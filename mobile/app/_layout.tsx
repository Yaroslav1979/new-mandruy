import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Утримуємо сплеш-скрін до завантаження
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  const colorScheme = useColorScheme();
  
  const [fontsLoaded, fontError] = Font.useFonts({
    'Ukrainian-Medium': require('../assets/fonts/e-Ukraine-Medium.otf'),
    'Ukrainian-Regular': require('../assets/fonts/e-Ukraine-Regular.otf'),
    'Ukrainian-Bold': require('../assets/fonts/e-Ukraine-Bold.otf'), 
  });


  // Використовуємо useEffect для підвантаження шрифтів
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Поки шрифти вантажаться, не показуємо інтерфейс
  if (!fontsLoaded && !fontError) {
    return null;
  };


  return (
    <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

