import {TextEncoder, TextDecoder} from 'text-encoding';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    RefreshControl,
    FlatList,
    ActivityIndicator
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import {useEffect, useState} from "react";
import {AntDesign} from '@expo/vector-icons';
import * as FileSystem from "expo-file-system";
import mammoth from "mammoth";
import {Buffer} from 'buffer';
import {getParts, RenderItemMainView} from "../Extractor";


export default function MainView({navigation}) {
    const [pickedFiles, setPickedFiles] = useState(null);
    const [convertedFiles, setConvertedFiles] = useState(null);
    const [hidden, setHidden] = useState(true);
    const [loading, setLoading] = useState(false);
    const handleConvert = async () => {
        const filesTexts = []

        setHidden(false)
        if (pickedFiles && convertedFiles === null) {
            setLoading(true)
            for (let i = 0; i < pickedFiles.length; i++) {
                const file = pickedFiles[i];
                const base64 = await FileSystem.readAsStringAsync(file.uri, {
                    encoding: FileSystem.EncodingType.Base64,
                }).then(r => 'data:application/msword;base64,' + r);
                const arrayBuffer = Buffer.from(base64, 'base64');
                const text = (await mammoth.extractRawText({arrayBuffer})).value;
                filesTexts.push({
                    name: file.name,
                    text: text.split('\n').join(' &&&&((())) ')
                });
            }
            setLoading(false)
            setConvertedFiles(filesTexts);
        }

    };
    const [searchText, setSearchText] = useState("");
    const [filesWithParts, setFilesWithParts] = useState([])
    useEffect(() => {
        if (searchText && convertedFiles && convertedFiles.length > 0 && searchText.length > 0) {
            const newParts = []
            convertedFiles.forEach(file => {
                const part = getParts(file, searchText)
                newParts.push(part)
                setFilesWithParts(newParts)
            })
            setFilesWithParts(newParts)
        }
    }, [convertedFiles, searchText])

    return (
        <SafeAreaView
            style={{
                display: 'flex',
                backgroundColor: '#fff',
                minHeight: '100%',
            }}
        >
            <FlatList
                data={filesWithParts}
                keyExtractor={(item) => item.fileName + Math.random()}
                ListHeaderComponent={<>
                    {
                        loading &&
                        <ActivityIndicator size="large" color="black" style={{
                            marginTop: 60, position: 'absolute',
                            alignSelf: 'center'
                        }}/>
                    }

                    <TouchableOpacity
                        title="Select Doc"
                        style={{
                            borderColor: '#FFCC33',
                            borderWidth: 2,
                            width: 274,
                            height: 30,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingLeft: 5,
                            paddingRight: 5,
                            marginTop: 120,
                            alignSelf: 'center',
                        }}

                        disabled={loading}
                        onPress={async () => {
                            setLoading(true)
                            try {
                                // if(loading)return
                                setLoading(false)
                                setConvertedFiles(null)
                                const result = await DocumentPicker.getDocumentAsync(
                                    {
                                        multiple: true,
                                        type: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
                                    });
                                if (!result.canceled || result.assets[0]) {
                                    setPickedFiles(result.assets);
                                    setHidden(true)
                                }
                            } catch (e) {
                                setPickedFiles(null)
                                setLoading(false)
                            }
                        }}

                    >

                        <Text
                            style={{
                                color: '#FFCC33',
                                fontWeight: '700',
                                fontSize: 14,
                                lineHeight: 18,
                            }}
                        >
                            BROWSE
                        </Text>
                        <AntDesign name="caretdown" size={18} color="#FFCC33"/>

                    </TouchableOpacity>

                    <TextInput
                        style={{
                            borderColor: '#4388CC',
                            borderWidth: 2,
                            width: 274,
                            height: 30,
                            marginBottom: 20,
                            paddingLeft: 5,
                            paddingRight: 5,
                            color: '#4388CC',
                            fontWeight: '700',
                            marginTop: 40,
                            alignSelf: 'center',
                        }}
                        value={searchText}
                        onChangeText={(text) => {
                            setSearchText(text)
                            setHidden(true)
                            setLoading(false)
                        }}
                        placeholder="KEYWORDS"
                        placeholderFontSize={14}
                        placeholderTextColor="#4388CC"
                        placeholderFontWeight="700"
                    />

                    <TouchableOpacity
                        title="Convert"
                        style={{
                            backgroundColor: '#FFCC33',
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            borderColor: '#2E8B57',
                            borderWidth: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                            marginBottom: 20,
                            marginTop: 50,
                        }}
                        disabled={loading}
                        onPress={handleConvert}
                    >
                        <Text
                            style={{
                                color: '#2E8B57',
                                fontWeight: '700',
                                fontSize: 18,
                                lineHeight: 18,
                            }}
                        >
                            SEARCH
                        </Text>
                    </TouchableOpacity>
                    <View
                        style={{
                            width: '100%',
                            height: 2,
                            backgroundColor: '#2E8B57',
                            marginTop: 30,
                        }}
                    />

                </>
                }
                renderItem={({item, index}) => {
                    if (hidden || loading) return null
                    return <RenderItemMainView
                        item={item}
                        index={index}
                        navigation={navigation}
                        searchText={searchText}
                    />
                }}

            />
        </SafeAreaView>
    );
}

