import type { StoryObj } from "@storybook/react";
import BoxMain from "../../components/threeJS/BoxMain";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "ThreeJS/Box",
  component: BoxMain,
  argTypes: {
    color: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// // More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    color: "red",
  },
};

// export const Secondary: Story = {
//   args: {
//     label: 'Button',
//   },
// };
