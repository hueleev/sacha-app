import type { StoryObj } from "@storybook/react";
import SampleMain from "../../components/threeJS/SampleMain";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "ThreeJS/Sample",
  component: SampleMain,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "color" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// // More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    color: "red",
  },
};
