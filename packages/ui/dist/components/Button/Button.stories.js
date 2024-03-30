"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archived = exports.Pinned = exports.Default = void 0;
const react_native_1 = require("react-native");
const Button_1 = __importDefault(require("./Button"));
function ButtonStory() {
    return (<react_native_1.View>
      <Button_1.default title="Hello"/>
    </react_native_1.View>);
}
exports.default = {
    title: 'Button',
    component: ButtonStory,
    argTypes: {
        onPinTask: { action: 'onPinTask' },
        onArchiveTask: { action: 'onArchiveTask' },
    },
};
exports.Default = {
    args: {
        task: {
            id: '1',
            title: 'Test Task',
            state: 'TASK_INBOX',
        },
    },
};
exports.Pinned = {
    args: { task: { ...exports.Default.args.task, state: 'TASK_PINNED' } },
};
exports.Archived = {
    args: { task: { ...exports.Default.args.task, state: 'TASK_ARCHIVED' } },
};
//# sourceMappingURL=Button.stories.js.map