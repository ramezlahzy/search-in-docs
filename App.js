import {StatusBar} from 'expo-status-bar';
import MainView from "./src/Screens/MainView";
import Page from "./src/Screens/Page";
import {Text} from "react-native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer,} from "@react-navigation/native";
import "react-native-gesture-handler";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {SafeAreaProvider} from "react-native-safe-area-context";
const Stack = createNativeStackNavigator();

export default function App() {
    const Test = () => {
        return <Text>Test</Text>
    }
    return (
        <SafeAreaProvider style={{flex: 1}}>
            <GestureHandlerRootView style={{
                flex: 1,
                backgroundColor: '#fff',
            }}>
                <NavigationContainer>
                    <Stack.Navigator >
                        <Stack.Screen name="MainView" component={MainView} options={{headerShown: false}}/>
                        <Stack.Screen name="OneDoc" component={Page} options={{headerShown:false}}/>
                    </Stack.Navigator>
                </NavigationContainer>

            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}

