"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archived = exports.Pinned = exports.Default = void 0;
const Logo_1 = __importDefault(require("./Logo"));
exports.default = {
    title: 'Logo',
    component: Logo_1.default,
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
//# sourceMappingURL=Logo.stories.js.map