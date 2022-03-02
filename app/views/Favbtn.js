import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';
import {add, remove, useFavorites} from '../redux/favSlicer';
import firestore from '@react-native-firebase/firestore';
import {getFcmToken} from '../store/token';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Favbtn = ({favId, isBig = true}) => {
  // const [isFav, setIsFav] = useState(false);
  const [isFound, setIsFound] = useState(false); // is Fav already exist in storage?
  const favoriteId = useSelector(useFavorites);
  const dispatch = useDispatch();

  const handleFavorite = async key => {
    // console.log(key, '<========= the Fav Key');
    // const favCollection = [];
    if (_.isNull(key) || _.isUndefined(key)) {
      console.error('Fav key is null or undefined');
      return;
    }

    // console.log(getFcmToken());
    const token = await getFcmToken();
    if (isFound) {
      try {
        await firestore()
          .collection('Masjid')
          .doc(favId)
          .update({
            tokens: firestore.FieldValue.arrayRemove(token),
          });
        dispatch(remove(favId));
      } catch (e) {
        console.log(e, 'error on token remove');
      }
    } else {
      try {
        await firestore()
          .collection('Masjid')
          .doc(favId)
          .update({
            tokens: firestore.FieldValue.arrayUnion(token),
          });
        dispatch(add(favId));
      } catch (e) {
        console.log(e, 'error on token add');
      }
    }

    // if (!_.isNull(favoriteId)) {
    //   favoriteId.forEach(e => {
    //     if (!_.isNull(e) && !_.isUndefined(e)) {
    //       console.log(e, _.isNull(e), typeof e);
    //       favCollection.push(e);
    //     }
    //   });
    // }

    // console.log(isFav, isFound, favCollection, '<=========== testing');

    // if (!isFav && !isFound) {
    //   setIsFound(true);
    //   dispatch(add(favId));
    //   // await AsyncStorage.setItem('favorites', JSON.stringify([favId]));
    // }

    // if (isFav && !isFound) {
    //   favCollection.push(favId);
    //   console.log(favCollection, '<======= added in favs');
    //   setIsFound(true);
    //   await AsyncStorage.setItem('favorites', JSON.stringify(favCollection));
    // }

    // if (isFav && isFound) {
    //   _.remove(favCollection, function (c) {
    //     return c === favId;
    //   });
    //   console.log(favCollection, '<=========== removed from favs');
    //   setIsFound(false);
    //   await AsyncStorage.setItem('favorites', JSON.stringify(favCollection));
    // }
    // if (_.isUndefined(onRefresh)) {
    //   return null;
    // } else {
    //   onRefresh();
    // }
  };

  useEffect(() => {
    // console.log('In Favorite Btn effect');
    if (!_.isEmpty(favoriteId)) {
      // console.log('not empty', favoriteId);
      if (_.includes(favoriteId, favId)) {
        // console.log('found', favoriteId, favId);
        setIsFound(true);
      } else {
        // console.log('not found', favoriteId, favId);
        setIsFound(false);
      }
    } else {
      console.log('empty Fav Id', favoriteId);
      setIsFound(false);
    }

    // async function getFavStore() {
    //   try {
    //     // await AsyncStorage.removeItem('favorites');
    //     // const value = await AsyncStorage.getItem('favorites');
    //     if (value !== null) {
    //       setIsFav(true);
    //       console.log(
    //         value,
    //         typeof value,
    //         '<========== before the pasrsing of favs',
    //       );
    //       const parseValue = JSON.parse(value);
    //       if (_.includes(parseValue, favId)) {
    //         setIsFound(true);
    //       } else {
    //         setIsFound(false);
    //       }
    //     } else {
    //       setIsFav(false);
    //       setIsFound(false);
    //       return null;
    //     }
    //   } catch (e) {
    //     // setError(e);
    //     console.log(e);
    //   }
    // }
    // getFavStore();
    // return () => {};
  }, [favId, favoriteId]);

  return (
    <>
      {isBig ? (
        <TouchableOpacity
          onPress={() => handleFavorite(favId)}
          style={styles.favBtn}>
          <Entypo
            style={{padding: 15}}
            name="star"
            color={isFound ? '#8D2828' : '#5C5C5C'}
            size={30}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => handleFavorite(favId)}
          style={styles.favBtn}>
          {/*<Animated.View>*/}
          <Entypo
            name="star"
            style={{padding: 10}}
            color={isFound ? '#8D2828' : '#5C5C5C'}
            size={25}
          />
          {/*</Animated.View>*/}
        </TouchableOpacity>
      )}
    </>
  );
};

export default Favbtn;
const styles = StyleSheet.create({
  favBtn: {
    backgroundColor: '#d0d0d0',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
});
