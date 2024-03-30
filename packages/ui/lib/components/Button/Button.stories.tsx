import { View } from 'react-native';
import Button from './Button';

function ButtonStory() {
  return (
    <View>
      <Button title="Hello" />
    </View>
  );
}

export default {
  title: 'Button',
  component: ButtonStory,
  argTypes: {
    onPinTask: { action: 'onPinTask' },
    onArchiveTask: { action: 'onArchiveTask' },
  },
};

export const Default = {
  args: {
    task: {
      id: '1',
      title: 'Test Task',
      state: 'TASK_INBOX',
    },
  },
};

export const Pinned = {
  args: { task: { ...Default.args.task, state: 'TASK_PINNED' } },
};

export const Archived = {
  args: { task: { ...Default.args.task, state: 'TASK_ARCHIVED' } },
};