/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';

const Favbtn = ({favId}) => {
  const [isFav, setIsFav] = useState(false); // is Fav contains?
  const [isFound, setIsFound] = useState(false); // is Fav already exist in storage?

  const handleFavourite = async key => {
    console.log(key);
    const value = await AsyncStorage.getItem('favorites');
    console.log(value);
    const favCollection = [];
    const value1 = JSON.parse(value);

    value1.forEach(e => {
      console.log(e, typeof e);
      favCollection.push(e);
    });

    console.log(isFav, isFound, '<=========== testing');

    if (!isFav && !isFound) {
      setIsFound(true);
      return await AsyncStorage.setItem('favorites', JSON.stringify([favId]));
    }

    if (isFav && !isFound) {
      favCollection.push(favId);
      console.log(favCollection, '<======= added in favs');
      setIsFound(true);
      return await AsyncStorage.setItem(
        'favorites',
        JSON.stringify(favCollection),
      );
    }

    if (isFav && isFound) {
      _.remove(favCollection, function (c) {
        return c === favId;
      });
      console.log(favCollection, '<=========== removed from favs');
      setIsFound(false);
      return await AsyncStorage.setItem(
        'favorites',
        JSON.stringify(favCollection),
      );
    }

    return null;
  };

  useEffect(() => {
    async function getFavStore() {
      try {
        // await AsyncStorage.removeItem('favorites');
        const value = await AsyncStorage.getItem('favorites');
        if (value !== null) {
          setIsFav(true);
          console.log(
            value,
            typeof value,
            '<========== before the pasrsing of favs',
          );
          const parseValue = JSON.parse(value);
          if (_.includes(parseValue, favId)) {
            setIsFound(true);
          } else {
            setIsFound(false);
          }
        } else {
          setIsFav(false);
          setIsFound(false);
          return null;
        }
      } catch (e) {
        // setError(e);
        console.log(e);
      }
    }
    getFavStore();
    return () => {};
  }, [favId]);

  return (
    <TouchableOpacity
      onPress={() => handleFavourite(favId)}
      style={{
        backgroundColor: '#E1E1E1',
        borderRadius: 100,
        marginRight: 10,
        textAlign: 'center',
        padding: 15,
        marginTop: -20,
      }}>
      <Entypo name="star" color={isFound ? '#8D2828' : '#5C5C5C'} size={25} />
    </TouchableOpacity>
  );
};

export default Favbtn;
