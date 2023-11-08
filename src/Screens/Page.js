import {Text, FlatList, View} from 'react-native';
import {useState} from "react";
import HighlightText from '@sanar/react-native-highlight-text';
const Page = ({route}) => {
    const {file} = route.params;
    let fileSplit = file.text.split(' ')
        .join(' ').split('\n')
        .join(' ').split('\t').join(' ').split(' ')
    fileSplit = fileSplit.filter(word => word.length > 0)
    const [offset, setOffset] = useState(0)
    const parts = fileSplit.join(' ').split(file.searchedPart)
    let i = 1
    while (i < parts.length) {
        parts.splice(i, 0, file.searchedPart)
        i += 2
    }
    const onLayout = () => {
        this.list.scrollToOffset({animated: true, offset: offset})
    }
    return <View
        style={{
            display: 'flex',
            backgroundColor: '#fff',
            minHeight: '100%',
            flex: 1,
            padding: 20,
        }}
        onLayout={() => onLayout()}
    >

        <FlatList
            data={parts}
            keyExtractor={(item) => item.toString() + Math.random()}
            ref={el => this.list = el}

            viewabilityConfig={{itemVisiblePercentThreshold: 0}}
            renderItem={({item, index}) => {
                return (
                    <>
                        {
                            index === 0 &&
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    margin: 20,
                                    color: '#4388CC',
                                    marginTop: 100,
                                }}
                            >
                                {file.fileName}
                            </Text>

                        }
                        {
                            index % 2 === 0 &&

                            <HighlightText
                                highlightStyle={{   backgroundColor: '#ECF00B',
                                    color: 'green',
                                    fontWeight: 'bold',
                            }}
                                searchWords={file.searchedWords}
                                textToHighlight={item.split('&&&&((()))').join('\n')}
                                onLayout={(event) => {
                                    let {x, y, width, height} = event.nativeEvent.layout;
                                    if (index === 0)
                                        setOffset(height)
                                }}
                            />

                        }


                        {index % 2 === 1 &&
                            <HighlightText
                                highlightStyle={{   backgroundColor: '#ECF00B',
                                    color: 'green',
                                    fontWeight: 'bold',
                            }}
                                searchWords={file.searchedWords}
                                textToHighlight={item.split('&&&&((()))').join('\n')}
                                style={{
                                    fontWeight: 'bold',
                                    color: '#000000',
                                    fontSize: 15
                                }}
                            />}
                    </>
                )
            }}
        />

    </View>;
}

export default Page;

