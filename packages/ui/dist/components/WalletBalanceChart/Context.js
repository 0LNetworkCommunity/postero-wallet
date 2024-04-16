"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChart = exports.Context = void 0;
const react_1 = require("react");
exports.Context = (0, react_1.createContext)(null);
function useChart() {
    return (0, react_1.useContext)(exports.Context);
}
exports.useChart = useChart;
//# sourceMappingURL=Context.js.map