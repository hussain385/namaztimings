import {StyleSheet, Dimensions, Platform} from 'react-native';

const conStyles = StyleSheet.create({
  safeAreaMy: {
    flex: 1,
    backgroundColor: 'white',
  },
  scroll: {
    justifyContent: 'space-evenly',
    flexGrow: 1,
    minHeight: Dimensions.get('window').height / 2,
  },
});
const cardStyles = StyleSheet.create({
  storeCard: {
    borderRadius: 10,
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  cImgWrap: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  cTextWrap: {
    padding: 10,
  },
});
const headerStyles = StyleSheet.create({
  storeStyles: {
    minHeight: 100,
    // paddingTop:getStatusBarHeight(true),
    backgroundColor: '#1F441E',
  },
  cartTxt: {
    position: 'absolute',
    right: -5,
    width: 18,
    height: 18,
    borderRadius: 100,
    elevation: 5,
    backgroundColor: '#CEE6B4',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    top: -6,
  },
});
const textStyles = StyleSheet.create({
  bolding: {
    color: '#000000',
    fontSize: 20,
  },
  simple: {
    fontFamily: 'Lato-Regular',
    fontSize: 15,
    color: 'black',
    flexWrap: 'wrap',
  },
  bold: {
    fontFamily: 'Lato-Bold',
    fontSize: 30,
    color: 'black',
    flexWrap: 'wrap',
  },
});
const textIn = StyleSheet.create({
  label: {
    paddingTop: 20,
  },
  Flabel: {
    paddingTop: 50,
  },
  input: {
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    paddingTop: 5,
    fontSize: 17,
    paddingBottom: 5,
    color: '#000000',
  },
});
const btnStyles = StyleSheet.create({
  basic: {
    backgroundColor: '#1F441E',
    borderRadius: 5,
    color: 'white',
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: 11,
    alignItems: 'center',
  },
  cartBtn: {
    backgroundColor: '#1F441E',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    width: '100%',
  },
  cartBtn1: {
    backgroundColor: '#808080',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  plusBtn: {
    borderRadius: 200,
    // width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  cartBtnOutline: {
    backgroundColor: 'white',
    borderRadius: 5,
    color: 'white',
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: 11,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1F441E',
  },
  cartBtnOutline1: {
    backgroundColor: 'white',
    borderRadius: 5,
    color: 'white',
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    paddingVertical: 11,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'silver',
  },
});
const bottomTab = StyleSheet.create({
  cartSheet: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
    elevation: 24,
  },
});
const lines = StyleSheet.create({
  simple: {
    width: '100%',
    marginVertical: 10,
    borderBottomColor: '#EFEFF4',
    borderBottomWidth: 1,
  },
});

export {
  conStyles,
  textStyles,
  textIn,
  btnStyles,
  headerStyles,
  cardStyles,
  bottomTab,
  lines,
};
