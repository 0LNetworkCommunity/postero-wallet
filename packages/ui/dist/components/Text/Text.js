"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const theme_1 = require("../../theme");
const Text = (0, react_1.forwardRef)(function Text(props, ref) {
    let { display, text, xs, sm, md, lg, xl, xxl, regular, medium, semibold, bold, ...rnTextProps } = props;
    const style = {};
    if (md) {
        style.fontSize = 36;
        style.lineHeight = 44;
        style.letterSpacing = -0.72;
    }
    else if (lg) {
        style.fontSize = 48;
        style.lineHeight = 60;
        style.letterSpacing = -0.96;
    }
    else if (xl) {
        style.fontSize = 60;
        style.lineHeight = 72;
        style.letterSpacing = -1.2;
    }
    else if (xxl) {
        style.fontSize = 72;
        style.lineHeight = 90;
        style.letterSpacing = -1.44;
    }
    if (display) {
        if (regular) {
            style.fontFamily = theme_1.fonts.primary[400];
        }
        else if (medium) {
            style.fontFamily = theme_1.fonts.primary[500];
        }
        else if (semibold) {
            style.fontFamily = theme_1.fonts.primary[600];
        }
        else if (bold) {
            style.fontFamily = theme_1.fonts.primary[700];
        }
    }
    return <react_native_1.Text style={style} {...rnTextProps} ref={ref}/>;
});
exports.default = Text;
//# sourceMappingURL=Text.js.map