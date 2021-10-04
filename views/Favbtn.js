import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';
import {add, remove} from '../redux/favSlicer';

const Favbtn = ({favId, isBig = true}) => {
  // const [isFav, setIsFav] = useState(false);
  const [isFound, setIsFound] = useState(false); // is Fav already exist in storage?
  const favoriteId = useSelector(state => state.favorites.value);
  const dispatch = useDispatch();

  const handleFavorite = async key => {
    // console.log(key, '<========= the Fav Key');
    // const favCollection = [];
    if (_.isNull(key) || _.isUndefined(key)) {
      console.error('Fav key is null or undefined');
      return;
    }

    if (isFound) {
      dispatch(remove(favId));
    } else {
      dispatch(add(favId));
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
      console.log('empty', favoriteId);
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
          style={{
            backgroundColor: '#E1E1E1',
            borderRadius: 100,
            marginRight: 10,
            textAlign: 'center',
            padding: 14,
            marginTop: -10,
            zIndex: 10,
          }}>
          <Entypo
            name="star"
            color={isFound ? '#8D2828' : '#5C5C5C'}
            size={25}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => handleFavorite(favId)}
          style={{
            backgroundColor: '#E1E1E1',
            height: 43,
            borderRadius: 100,
            marginRight: 10,
            textAlign: 'center',
            padding: 10,
            marginTop: -10,
            zIndex: 10,
          }}>
          <Entypo
            name="star"
            color={isFound ? '#8D2828' : '#5C5C5C'}
            size={20}
          />
        </TouchableOpacity>
      )}
    </>
  );
};

export default Favbtn;
