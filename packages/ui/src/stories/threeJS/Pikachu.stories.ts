import type { StoryObj } from "@storybook/react";
import PikachuMain from "../../components/threeJS/PikachuMain";

const meta = {
  title: "ThreeJS/Pikachu",
  component: PikachuMain,
} as const;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
