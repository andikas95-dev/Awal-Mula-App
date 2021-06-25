import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Card, SearchBar, Button} from 'react-native-elements';
// import {Header} from 'react-native-elements';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Home({navigation}) {
  const [data, setData] = useState({});
  const [search, setSearch] = useState('');
  useEffect(() => {
    axios
      .get(
        'https://staging.awalmula.co.id/rest/default/V1/products?searchCriteria[pageSize]=27',
      )
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const formatData = (dataItem, numColumns) => {
    if (!dataItem) {
      return [];
    }
    const numberOfFullRows = Math.floor(dataItem?.length / numColumns);

    let numberOfElementsLastRow =
      dataItem?.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      dataItem?.push({key: `blank-${numberOfElementsLastRow}`, empty: true});
      numberOfElementsLastRow++;
    }

    return dataItem;
  };

  const showImageCard = item => {
    const image = item?.find(itemFind => itemFind.attribute_code === 'image');
    if (image?.value === undefined || image?.value === 'no_selection') {
      return 'https://via.placeholder.com/400x400.png?text=Awal+Mula';
    }
    return `https://staging.awalmula.co.id/pub/media/catalog/product${image?.value}`;
  };

  const numberFormatUnit = (number, unit, currency = false) => {
    const theNumber = new Intl.NumberFormat('de-DE').format(number);
    if (currency) {
      return `${unit} ${theNumber}`;
    }
    return `${theNumber} ${unit} `;
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <StatusBar backgroundColor="#cad9c1" />
        {/* <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} /> */}
        <View style={styles.sectionContainer}>
          <Image
            style={styles.logoHeader}
            source={{
              uri: 'https://www.awalmula.co.id/static/version1623946237/frontend/Magento/awalmula/id_ID/images/awalmula-logo-beta.png',
            }}
          />
        </View>
        <View style={styles.sectionFirst}>
          <View style={styles.sectionSearch}>
            <SearchBar
              placeholder="Cari Barang..."
              onChangeText={value => setSearch(value)}
              value={search}
              containerStyle={styles.searchContainer}
              round={true}
              lightTheme={isDarkMode ? false : true}
            />
            <Text style={styles.textWelcome}>Welcome, Customer</Text>
          </View>
        </View>
        <FlatList
          data={formatData(data?.items, 2)}
          numColumns={2}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            if (item.empty === true) {
              return <View style={[styles.viewCard, styles.itemInvisible]} />;
            }
            return (
              <View style={styles.viewCard}>
                <TouchableOpacity onPress={() => console.log('bisa')}>
                  <Card containerStyle={styles.card}>
                    <Image
                      style={styles.image}
                      resizeMode="cover"
                      source={{uri: showImageCard(item?.custom_attributes)}}
                    />
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardPrice}>
                      {numberFormatUnit(item.price || 0, 'Rp ', true)}
                    </Text>
                  </Card>
                </TouchableOpacity>
              </View>
            );
          }}
        />
        <View style={{marginTop: 20}}>
          <Button
            style={{height: 30}}
            title="Log Out"
            onPress={async () => {
              await AsyncStorage.removeItem('token');
              await navigation.replace('Splash');
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const windowHeight = Dimensions.get('window').height;
const containerHeight = windowHeight * 0.2;

const styles = StyleSheet.create({
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#cad9c1',
    // backgroundColor: '#476040',
    height: containerHeight / 2,
  },
  sectionFirst: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },
  sectionSearch: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
  },
  textWelcome: {
    marginVertical: 15,
    fontSize: 17,
    fontWeight: 'bold',
  },
  searchContainer: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  logoHeader: {
    flex: 1,
    height: containerHeight / 3,
    resizeMode: 'contain',
  },
  viewCard: {
    flex: 1,
    // height: 300,
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  card: {
    height: 220,
    borderRadius: 10,
    // textAlign: 'center',
  },
  cardTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    height: 30,
  },
  cardPrice: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  image: {
    // width: '100%',
    height: 100,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 7,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default Home;
