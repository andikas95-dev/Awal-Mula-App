import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Image,
  useColorScheme,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Input, Icon, Button} from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Toast} from 'native-base';

const Login = ({navigation}) => {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formLogin, setFormLogin] = useState({
    username: null,
    password: null,
  });
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleLogin = () => {
    setLoading(true);
    if (!formLogin.username || !formLogin.password) {
      setLoading(false);
      return null;
    }
    axios
      .post(
        'https://staging.awalmula.co.id/rest/V1/integration/admin/token',
        formLogin,
      )
      .then(res => {
        AsyncStorage.setItem('token', res.data);
        navigation.replace('Home');
      })
      .catch(err =>
        Toast.show({
          type: 'danger',
          text: 'Login Gagal',
        }),
      )
      .finally(() => setLoading(false));
    // axios.post();
  };
  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar backgroundColor="#cad9c1" />
      <Image
        style={styles.logoHeader}
        source={{
          uri: 'https://www.awalmula.co.id/static/version1623946237/frontend/Magento/awalmula/id_ID/images/awalmula-logo-beta.png',
        }}
      />
      <View style={styles.sectionForm}>
        <Input
          placeholder="Username"
          value={formLogin.username}
          leftIcon={
            <Icon name="user" size={24} color="#476040" type="font-awesome" />
          }
          onChangeText={value => setFormLogin({...formLogin, username: value})}
        />
        <Input
          name="password"
          placeholder="Password"
          value={formLogin.password}
          leftIcon={
            <Icon name="key" size={24} color="#476040" type="font-awesome" />
          }
          secureTextEntry={!showPass}
          rightIcon={
            <Icon
              name={showPass ? 'eye-slash' : 'eye'}
              size={14}
              color="#476040"
              type="font-awesome"
              onPress={() => setShowPass(!showPass)}
            />
          }
          onChangeText={value => setFormLogin({...formLogin, password: value})}
        />
        <Button
          title="Sign In"
          buttonStyle={{backgroundColor: '#476040'}}
          onPress={() => handleLogin()}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
};

export default Login;

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#cad9c1',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoHeader: {
    height: windowHeight / 5,
    width: windowWidth / 1.5,
    resizeMode: 'contain',
  },
  sectionForm: {
    width: windowWidth / 1.2,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
});
