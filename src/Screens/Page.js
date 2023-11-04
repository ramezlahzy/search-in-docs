import {Text, ScrollView} from 'react-native';

const Page = ({route}) => {
    const {file} = route.params;
    let text = file.text;
    let searchText = file.searchText;
    return <ScrollView
        style={{
            display: 'flex',
            backgroundColor: '#fff',
            minHeight: '100%',
        }}
    >
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
        <Text
            style={{
                fontSize: 15,
                textAlign: 'center',
                margin: 20,
                color: '#000000',
                marginTop: 50,
            }}
        >
            {text.split(searchText).map((item, index) => {
                return (
                    <Text key={index}>
                        {item}
                        <Text style={{
                            backgroundColor: 'yellow'
                        }}>
                            {searchText}
                        </Text>
                    </Text>
                )
            })}
            {/*{file.text}*/}
        </Text>
    </ScrollView>;
}
export default Page;
