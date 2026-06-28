import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MoreScreen } from '../screens/more/MoreScreen';
import { ChatsScreen } from '../screens/chats/ChatsScreen';
import { BroadcastScreen } from '../screens/broadcast/BroadcastScreen';
import { PaymentsScreen } from '../screens/payments/PaymentsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { SubscriptionScreen } from '../screens/subscription/SubscriptionScreen';
import { CustomizationScreen } from '../screens/customization/CustomizationScreen';
import { CommandsScreen } from '../screens/commands/CommandsScreen';
import { colors } from '../utils/theme';

export type MoreStackParamList = {
  MoreMenu: undefined;
  Chats: undefined;
  Broadcast: undefined;
  Payments: undefined;
  Settings: undefined;
  Subscription: undefined;
  Customization: undefined;
  Commands: undefined;
};

const Stack = createNativeStackNavigator<MoreStackParamList>();

export const MoreNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textInverse,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="MoreMenu"
        component={MoreScreen}
        options={{ title: 'More' }}
      />
      <Stack.Screen name="Chats" component={ChatsScreen} />
      <Stack.Screen name="Broadcast" component={BroadcastScreen} />
      <Stack.Screen name="Payments" component={PaymentsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="Customization" component={CustomizationScreen} />
      <Stack.Screen name="Commands" component={CommandsScreen} />
    </Stack.Navigator>
  );
};
