"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const GmailStyleSwipeableRow_1 = __importDefault(require("./GmailStyleSwipeableRow"));
const Row = ({ item }) => (<react_native_gesture_handler_1.RectButton style={styles.rectButton} onPress={() => alert(item.from)}>
    <react_native_1.Text style={styles.fromText}>{item.from}</react_native_1.Text>
    <react_native_1.Text numberOfLines={2} style={styles.messageText}>
      {item.message}
    </react_native_1.Text>
    <react_native_1.Text style={styles.dateText}>
      {item.when} {'❭'}
    </react_native_1.Text>
  </react_native_gesture_handler_1.RectButton>);
const SwipeableRow = ({ item, index }) => {
    return (<GmailStyleSwipeableRow_1.default>
        <Row item={item}/>
      </GmailStyleSwipeableRow_1.default>);
};
class Example extends react_1.Component {
    render() {
        return (<react_native_gesture_handler_1.FlatList data={DATA} ItemSeparatorComponent={() => <react_native_1.View style={styles.separator}/>} renderItem={({ item, index }) => (<SwipeableRow item={item} index={index}/>)} keyExtractor={(item, index) => `message ${index}`}/>);
    }
}
exports.default = Example;
const styles = react_native_1.StyleSheet.create({
    rectButton: {
        flex: 1,
        height: 80,
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    separator: {
        backgroundColor: 'rgb(200, 199, 204)',
        height: react_native_1.StyleSheet.hairlineWidth,
    },
    fromText: {
        fontWeight: 'bold',
        backgroundColor: 'transparent',
    },
    messageText: {
        color: '#999',
        backgroundColor: 'transparent',
    },
    dateText: {
        backgroundColor: 'transparent',
        position: 'absolute',
        right: 20,
        top: 10,
        color: '#999',
        fontWeight: 'bold',
    },
});
const DATA = [
    {
        from: "D'Artagnan",
        when: '3:11 PM',
        message: 'Unus pro omnibus, omnes pro uno. Nunc scelerisque, massa non lacinia porta, quam odio dapibus enim, nec tincidunt dolor leo non neque',
    },
    {
        from: 'Aramis',
        when: '11:46 AM',
        message: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus hendrerit ligula dignissim maximus aliquet. Integer tincidunt, tortor at finibus molestie, ex tellus laoreet libero, lobortis consectetur nisl diam viverra justo.',
    },
    {
        from: 'Athos',
        when: '6:06 AM',
        message: 'Sed non arcu ullamcorper, eleifend velit eu, tristique metus. Duis id sapien eu orci varius malesuada et ac ipsum. Ut a magna vel urna tristique sagittis et dapibus augue. Vivamus non mauris a turpis auctor sagittis vitae vel ex. Curabitur accumsan quis mauris quis venenatis.',
    },
    {
        from: 'Porthos',
        when: 'Yesterday',
        message: 'Vivamus id condimentum lorem. Duis semper euismod luctus. Morbi maximus urna ut mi tempus fermentum. Nam eget dui sed ligula rutrum venenatis.',
    },
    {
        from: 'Domestos',
        when: '2 days ago',
        message: 'Aliquam imperdiet dolor eget aliquet feugiat. Fusce tincidunt mi diam. Pellentesque cursus semper sem. Aliquam ut ullamcorper massa, sed tincidunt eros.',
    },
    {
        from: 'Cardinal Richelieu',
        when: '2 days ago',
        message: 'Pellentesque id quam ac tortor pellentesque tempor tristique ut nunc. Pellentesque posuere ut massa eget imperdiet. Ut at nisi magna. Ut volutpat tellus ut est viverra, eu egestas ex tincidunt. Cras tellus tellus, fringilla eget massa in, ultricies maximus eros.',
    },
    {
        from: "D'Artagnan",
        when: 'Week ago',
        message: 'Aliquam non aliquet mi. Proin feugiat nisl maximus arcu imperdiet euismod nec at purus. Vestibulum sed dui eget mauris consequat dignissim.',
    },
    {
        from: 'Cardinal Richelieu',
        when: '2 weeks ago',
        message: 'Vestibulum ac nisi non augue viverra ullamcorper quis vitae mi. Donec vitae risus aliquam, posuere urna fermentum, fermentum risus. ',
    },
];
//# sourceMappingURL=Swipeable.js.map