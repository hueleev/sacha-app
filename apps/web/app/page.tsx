"use client";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/storybook");
  };
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm" onClick={handleClick}>
          Storybook
        </Button>
      </div>
    </div>
  );
}
