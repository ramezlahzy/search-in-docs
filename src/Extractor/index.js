import {View, Text, TouchableOpacity, FlatList} from 'react-native'
import HighlightText from '@sanar/react-native-highlight-text';

const maxPartWords = 10
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
const RenderItemMainView = ({item, index, navigation}) => {
    return (<View key={index}
                  style={{
                      marginTop: 20,
                      marginLeft: 20,
                      marginRight: 20,
                  }}
    >
        <Text
            style={{
                fontWeight: 'bold', color: '#4388CC',
                marginBottom: 10, fontSize: 16
            }}
        >
            {item.fileName}
            <Text
                style={{
                    fontWeight: '700', color: '#F31B1B', fontSize: 16
                }}
            >
                <Text
                    style={{
                        fontWeight: 'bold', color: '#2E8B57', fontSize: 16
                    }}
                >

                    {"  " + item.fileParts.length + " "}
                </Text>
                occurrences
            </Text>
        </Text>
        {item.fileParts.map((filePart, index) => {
            return (<TouchableOpacity key={index}
                                      style={{
                                          marginBottom: 20
                                      }}
                                      onPress={() => {
                                          navigation.navigate("OneDoc", {
                                              file: {
                                                  ...item,
                                                  searchedPart: filePart.text.join(' ')
                                              }
                                          })
                                      }}
                >
                    <HighlightText
                        highlightStyle={{
                            backgroundColor: '#ECF00B',
                            color: 'green',
                            fontWeight: 'bold',
                        }}
                        searchWords={item.searchedWords}
                        textToHighlight={(index + 1) + "- " + filePart.text.join(' ').split('&&&&((()))').join(' ')}
                        style={{
                            fontWeight: 'bold',
                            color: '#000000',
                            fontSize: 15
                        }}
                    />

                </TouchableOpacity>
            )
        })}
        <View

            style={{
                width: '100%', height: 2, backgroundColor: '#000000', marginTop: 30,
            }}
        />
    </View>)

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
                beginIndex: i,
                endIndex: i + publishedParts.length
            })
            while (checkFoundWord(currentReachedParts, searchedWords)) {
                currentReachedParts.shift()
            }

        }
    }
    return {fileParts, fileName: file.name, searchedWords, text: file.text}
}
export {RenderItemMainView, checkFoundWord, getParts}
