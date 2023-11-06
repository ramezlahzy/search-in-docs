import {View, Text, ScrollView, TouchableOpacity} from 'react-native'
import {useEffect, useState} from "react";

const maxPartWords = 10
const Extractor = ({navigation, files, searchText}) => {
    const [filesWithParts, setFilesWithParts] = useState([])
    const checkFoundWord = (currentWords, searchedWords) => {
        let found = true
        const currentWordsLowerCase = currentWords.map(word => word?.toLowerCase())
        for (let j = 0; j < searchedWords.length; j++) {
            let flag = false;
            for (let i = 0; i < currentWordsLowerCase.length; i++) {
                if (currentWordsLowerCase[i]?.includes(searchedWords[j].toLowerCase()))
                    flag = true
            }
            if (!flag) {
                found = false
                break;
            }
        }
        return found
    }
    const getParts = (file, searchText) => {
        const searchedWords = searchText.split(' ')
        const fileParts = []
        let fileSplit = file.text.split(' ')
            .join(' ').split('\n')
            .join(' ').split('\t').join(' ').split(' ')
        fileSplit = fileSplit.filter(word => word.length > 0)
        const currentReachedParts = []
        for (let i = 0; i < fileSplit.length; i++) {
            currentReachedParts.push(fileSplit[i])
            if (currentReachedParts.length > maxPartWords) currentReachedParts.shift()
            let found = checkFoundWord(currentReachedParts, searchedWords)
            if (found) {
                const publishedParts = [...currentReachedParts]
                for (let j = i + 1; j < maxPartWords + i && i < fileSplit.length; j++) {
                    publishedParts.push(fileSplit[j])
                }
                fileParts.push({
                    text: publishedParts,
                })
                while (checkFoundWord(currentReachedParts, searchedWords)) {
                    currentReachedParts.shift()
                }

            }

        }

        return {fileParts, fileName: file.name, searchedWords, text: file.text}

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
            display: 'flex', backgroundColor: '#fff',
        }}
    >
        {filesWithParts.map((part, index) => {
            return (<View key={index}>
                <Text
                    style={{
                        fontWeight: 'bold', color: '#4388CC',
                        marginBottom: 10,
                    }}
                >
                    {part.fileName}
                    <Text
                        style={{
                            fontWeight: '700', color: '#F31B1B',
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: 'bold', color: '#2E8B57',
                            }}
                        >

                            {"  " + part.fileParts.length + " "}
                        </Text>
                        occurrences
                    </Text>
                </Text>
                {part.fileParts.map((filePart, index) => {
                    return (<TouchableOpacity key={index}
                                              style={{
                                                  marginBottom: 20
                                              }}
                                              onPress={() => {
                                                  navigation.navigate("OneDoc", {
                                                      file: {
                                                          ...part,
                                                          searchedPart: filePart.text.join(' ')
                                                      }
                                                  })
                                              }}
                        >
                            <Text>
                                <Text
                                    style={{
                                        fontWeight: 'bold', color: '#000000', fontSize: 15,
                                    }}
                                >
                                    {1 + index + "-"}

                                </Text>
                                {filePart.text.map((item, index) => {
                                    let flag = false;
                                    for (let i = 0; i < part.searchedWords.length; i++) {
                                        if (item?.toLowerCase().includes(part.searchedWords[i].toLowerCase()))
                                            flag = true
                                    }
                                    if (flag) {
                                        return (<Text key={index}
                                                      style={{
                                                          backgroundColor: '#ECF00B',
                                                          borderColor: '#4388CC',
                                                          borderWidth: 2,
                                                          color: '#4388CC',
                                                      }}
                                        >
                                            {" " + item.split('&&&&((()))').join('\n')}
                                        </Text>)
                                    }
                                    return (<Text key={index}
                                                  style={{fontWeight: 'bold', color: '#000000', fontSize: 15}}>
                                        {" " + item.split('&&&&((()))').join('\n')}
                                    </Text>)
                                })}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
                <View

                    style={{
                        width: '100%', height: 2, backgroundColor: '#000000', marginTop: 30,
                    }}
                />
            </View>)
        })}
    </ScrollView>)
}
const extractText = (utf8) => {
    let beginTextIndex = -1;
    let endTextIndex = -1;
    const allChars = ['\n', '\t', '\r', ' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
        'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E',
        'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '.', ',', '?', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '+', '=',
        '{', '}', "'", '"', ':', ';', '<', '>', '/', '\\', '|', '[', ']', '`', '~', ' ', '¶'
    ];
    for (let i = 0; i < utf8.length; i++) {
        let flag = true
        let notIncluded = 0;
        for (let j = i; j < 140 + i; j++) {
            if (!allChars.includes(utf8[j]) && utf8[j] !== ' ') {
                notIncluded++
            }
            if (notIncluded > 20) {
                flag = false
                break;
            }
        }
        if (flag) {
            if (beginTextIndex === -1)
                beginTextIndex = i
            endTextIndex = i + 140
            break;
        }
    }
    // endTextIndex = beginTextIndex;
    let notIncluded = 0;
    console.log("begin ", beginTextIndex, " end ", endTextIndex)
    while (endTextIndex < utf8.length && notIncluded < 22) {
        endTextIndex++
        if (!allChars.includes(utf8[endTextIndex]) && utf8[endTextIndex] !== ' ') {
            notIncluded++
            //get number of character
            // const number = parseInt(utf8[endTextIndex])
            // console.log(number === utf8[endTextIndex])
            // console.log(((Charab)utf8[endTextIndex])
            // console.log("notIncluded", notIncluded, ("min" + utf8[endTextIndex] + "min") === "minmin")
        }
    }
    let text = "";
    for (let i = beginTextIndex; i < endTextIndex; i++) {
        if (allChars.includes(utf8[i]))
            text += utf8[i]
    }
    // console.log("begin ", beginTextIndex, " end ", endTextIndex)
    // return utf8.substring(beginTextIndex, endTextIndex)
    return text;

}
export {extractText}
export default Extractor
