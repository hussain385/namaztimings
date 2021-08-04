import React from 'react';
import {SafeAreaView, Text} from 'react-native';

const AdminNotification = ({
  route: {
    params: {requests},
  },
}) => {
  return (
    <SafeAreaView>
      {requests.map(req => (
        <Text>{JSON.stringify(req.data())}</Text>
      ))}
    </SafeAreaView>
  );
};

export default AdminNotification;
