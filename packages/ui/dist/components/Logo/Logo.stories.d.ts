import Logo from './Logo';
declare const _default: {
    title: string;
    component: typeof Logo;
    argTypes: {
        onPinTask: {
            action: string;
        };
        onArchiveTask: {
            action: string;
        };
    };
};
export default _default;
export declare const Default: {
    args: {
        task: {
            id: string;
            title: string;
            state: string;
        };
    };
};
export declare const Pinned: {
    args: {
        task: {
            state: string;
            id: string;
            title: string;
        };
    };
};
export declare const Archived: {
    args: {
        task: {
            state: string;
            id: string;
            title: string;
        };
    };
};
