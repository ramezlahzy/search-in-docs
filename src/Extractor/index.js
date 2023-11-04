import {View, Text, ScrollView, TouchableOpacity} from 'react-native'
import {useEffect, useState} from "react";

const min = (a, b) => {
    return a > b ? b : a
}
const max = (a, b) => {
    return a > b ? a : b
}
const Extractor = ({navigation, files, searchText}) => {
    const [filesWithParts, setFilesWithParts] = useState([])
    console.log("enter extractor")
    // console.log(files)
    const getParts = (file, searchText) => {
        const fileParts = []
        console.log("start")
        const textFile = file.text
        console.log(textFile.length)
        for (let i = 0; i < textFile.length; i++) {
            const j = i + searchText.length
            const subPart = textFile.substring(i, j);
            if (subPart === searchText) {
                const allThisPart = textFile.substring(i - 50, j + 50);
                console.log(allThisPart)
                fileParts.push({
                    text: allThisPart,
                    searchText: searchText,
                    beginSearchedText: 50 + ((i < 50) ? 50 - i : 0),
                    endSearchedText: 50 + ((i < 50) ? 50 - i : 0 + searchText.length)
                })
                console.log("found")
                console.log("beginSearchedText", i - min(50, i))
                console.log("endSearchedText", j - min(50, i))
            }

        }
        return {fileParts, fileName: file.name, searchText, text: file.text}

    }

    useEffect(() => {
        if (searchText && files && files.length > 0 && searchText.length > 0) {
            const newParts = []
            files.forEach(file => {
                const part = getParts(file, searchText)
                newParts.push(part)
                setFilesWithParts(newParts)
            })
            setFilesWithParts(newParts)
        }
    }, [files, searchText])
    return (<ScrollView
        style={{
            display: 'flex',
            backgroundColor: '#fff',
        }}
    >
        {filesWithParts.map((part, index) => {
            return (<TouchableOpacity key={index}
                                      style={{
                                          // borderColor: '#FFCC33', borderWidth: 2,
                                      }}
                                      onPress={() => {
                                          navigation.navigate("OneDoc", {file: part})
                                      }}
                >
                    <Text
                        style={{
                            fontWeight: 'bold',
                            color: '#4388CC',
                        }}
                    >
                        {part.fileName}
                        <Text
                            style={{
                                fontWeight: '700',
                                color: '#F31B1B',
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    color: '#2E8B57',
                                }}
                            >

                                {"  " + part.fileParts.length + " "}
                            </Text>
                            occurrences
                        </Text>
                    </Text>
                    {
                        part.fileParts.map((part, index) => {
                            return (<View key={index}
                                          style={{}}
                            >
                                <Text>
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                            color: '#000000',
                                            fontSize: 15,
                                        }}
                                    >
                                        {1 + index + "-"}

                                    </Text>
                                    {part.text.substring(0, part.beginSearchedText)}
                                    {/*<View*/}
                                    {/*    style={{*/}
                                    {/*        marginBottom: -10,*/}
                                    {/*        marginTop: -10,                     */}
                                    {/*    }}*/}
                                    {/*>*/}
                                        <Text style={{
                                            backgroundColor: '#ECF00B',
                                            borderColor: '#4388CC',
                                            borderWidth: 2,
                                            color:  '#4388CC',
                                        }}

                                        >

                                            {part.text.substring(part.beginSearchedText, part.endSearchedText)}
                                        </Text>
                                    {/*</View>*/}
                                    {part.text.substring(part.endSearchedText, part.text.length)}
                                </Text>
                            </View>)
                        })}
                    <View

                        style={{
                            width: '100%',
                            height: 2,
                            backgroundColor: '#000000',
                            marginTop: 30,
                        }}
                    />
                </TouchableOpacity>
            )
        })
        }
    </ScrollView>)
}
export default Extractor
