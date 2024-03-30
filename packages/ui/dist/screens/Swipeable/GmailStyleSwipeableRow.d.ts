import React, { Component } from 'react';
export default class GmailStyleSwipeableRow extends Component {
    renderLeftActions: (progress: any, dragX: any) => React.JSX.Element;
    renderRightActions: (progress: any, dragX: any) => React.JSX.Element;
    updateRef: (ref: any) => void;
    close: () => void;
    render(): React.JSX.Element;
}
