import { useEffect, useState } from "react";
import Image from "next/image";
import heartPillImg from "@workspace/ui/assets/image/heartPill_2.png";
import starPillImg from "@workspace/ui/assets/image/starPill_2.png";

const IMAGES = [
  { src: heartPillImg, size: 120, class: "animate-heartbeat" },
  { src: starPillImg, size: 150, class: "animate-spin-slow" },
] as const;

type ImgObj = (typeof IMAGES)[number];

export function LoadingSpinner() {
  const [mounted, setMounted] = useState(false);
  const [imgObj, setImgObj] = useState<ImgObj | null>(null);

  useEffect(() => {
    setMounted(true);
    // 타입 단언으로 undefined 방지
    const random = IMAGES[Math.floor(Math.random() * IMAGES.length)] as ImgObj;
    setImgObj(random);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className={imgObj?.class}>
        {mounted && imgObj && (
          <Image
            src={imgObj.src}
            alt="로딩"
            width={imgObj.size}
            height={imgObj.size}
            priority
          />
        )}
      </div>
      {mounted && (
        <div className="mt-8 text-gray-500 text-sm font-medium tracking-wide">
          Loading...
        </div>
      )}
      <style jsx global>
        {`
          @keyframes spin-slow {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          @keyframes heartbeat {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.15); /* 살짝 커지는 정도를 조절할 수 있어요 */
            }
            100% {
              transform: scale(1);
            }
          }
          .animate-spin-slow {
            animation: spin-slow 2s linear infinite;
          }
          .animate-heartbeat {
            animation: heartbeat 1s ease-in-out infinite; /* 1초마다, 부드럽게, 무한 반복 */
          }
        `}
      </style>
    </div>
  );
}
