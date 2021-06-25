import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {Image} from 'react-native-elements';

const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await navigation.replace('Home');
      } else {
        await navigation.replace('Login');
      }
    }, 3000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ECF4E7" />
      <Image
        style={styles.image}
        source={{
          uri: 'https://www.awalmula.co.id/media/icons/awalmula-loader.gif',
        }}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#ECF4E7',
  },
  image: {
    height: 150,
    resizeMode: 'contain',
  },
});
