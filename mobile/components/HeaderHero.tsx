import { ImageBackground } from 'react-native';
import { HeaderContent } from './HeaderContent';
import { HeaderHatContent } from './HeaderHatContent';

export function HeaderHero({
  isLandscape,
  screenHeight,
}: {
  isLandscape: boolean;
  screenHeight: number;
}) {
  if (isLandscape) {
    return (
      <ImageBackground
        source={require('@/assets/images/synevir.jpg')}
        style={{ height: screenHeight, 
                width: '100%'}}
        resizeMode="cover"
      >
        <HeaderContent overlay />
      </ImageBackground>
    );
  }
 
    return (
    
      <ImageBackground
        source={require('@/assets/images/synevir.jpg')}
        style={{ height: 250, 
                width: '100%'}}
        resizeMode="cover"
      >
        
      <HeaderHatContent overlay />

      </ImageBackground>
  );
}
