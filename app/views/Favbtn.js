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
    if (_.isNil(key)) {
      console.warn('Fav key is null or undefined');
      return;
    }

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
  };

  useEffect(() => {
    if (!_.isEmpty(favoriteId)) {
      if (_.includes(favoriteId, favId)) {
        setIsFound(true);
      } else {
        setIsFound(false);
      }
    } else {
      console.log('empty Fav Id', favoriteId);
      setIsFound(false);
    }
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
