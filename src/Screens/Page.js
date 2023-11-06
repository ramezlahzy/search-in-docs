import {Text, FlatList, View} from 'react-native';
import {useState} from "react";

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
                            < Text style={{
                                backgroundColor: '#fff',
                                letterSpacing: 1,
                                wordSpacing: 10,
                            }}
                                   onLayout={(event) => {
                                       let {x, y, width, height} = event.nativeEvent.layout;
                                       if (index === 0)
                                           setOffset(height)
                                   }}

                            >
                                {
                                    item.split('&&&&((()))').join('\n')
                                }
                            </Text>
                        }


                        {index % 2 === 1 &&
                            < Text style={{}}>
                                {
                                    item.split('&&&&((()))').join('\n')
                                        .split(' ').map((word, index) => {
                                        let flag = false;
                                        for (let i = 0; i < file.searchedWords.length; i++) {
                                            if (word?.toLowerCase().includes(file.searchedWords[i]?.toLowerCase()))
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
                                                {" " + word}
                                            </Text>)
                                        }
                                        return (<Text key={index}
                                                      style={{
                                                          fontWeight: 'bold',
                                                          color: '#000000',
                                                          fontSize: 15
                                                      }}>
                                            {" " + word}
                                        </Text>)
                                    })
                                }
                            </Text>
                        }

                    </>
                )
            }}
        />

    </View>;
}

export default Page;
