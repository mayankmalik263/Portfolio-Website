"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import ImageWithSkeleton from "./ImageWithSkeleton";

interface SwipeCardsProps {
  className?: string;
}

const SwipeCards = ({ className }: SwipeCardsProps) => {
  const [cards, setCards] = useState<Card[]>(cardData);

  const resetCards = () => {
    setCards(cardData);
  };

  return (
    <div
      className={cn(
        "relative grid h-[233px] w-[175px] place-items-center",
        className,
      )}
    >
      {cards.length === 0 && (
        <div style={{ gridRow: 1, gridColumn: 1 }} className="z-20">
          <Button onClick={resetCards} variant={"outline"}>
            <RefreshCw className="size-4" />
            Again
          </Button>
        </div>
      )}
      {cards.map((card, index) => {
        const depth = cards.length - 1 - index;
        return (
          <Card
            key={card.id}
            cards={cards}
            setCards={setCards}
            depth={depth}
            {...card}
          />
        );
      })}
    </div>
  );
};

const Card = ({
  id,
  url,
  setCards,
  cards,
  depth,
}: {
  id: number;
  url: string;
  setCards: Dispatch<SetStateAction<Card[]>>;
  cards: Card[];
  depth: number;
}) => {
  const x = useMotionValue(0);

  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);

  const isFront = id === cards[cards.length - 1]?.id;

  const rotate = useTransform(() => {
    const offset = isFront ? 0 : id % 2 ? 6 : -6;
    return `${rotateRaw.get() + offset}deg`;
  });

  const handleDragEnd = (
    event: any,
    info: { offset: { x: number }; velocity: { x: number } },
  ) => {
    // Project where a flick would land, so a fast short swipe still dismisses.
    const projected = info.offset.x + info.velocity.x * 0.2;
    if (Math.abs(projected) > 100) {
      const dir = Math.sign(projected);
      // Fly off with the finger's velocity, then remove.
      animate(x, dir * 400, {
        type: "spring",
        bounce: 0,
        duration: 0.35,
        velocity: info.velocity.x,
        onComplete: () => setCards((pv) => pv.filter((v) => v.id !== id)),
      });
    } else {
      animate(x, 0, {
        type: "spring",
        stiffness: 400,
        damping: 40,
        velocity: info.velocity.x,
      });
    }
  };

  return (
    <motion.div
      className="absolute h-[233px] w-[175px] origin-bottom overflow-hidden rounded-lg bg-white hover:cursor-grab active:cursor-grabbing"
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        boxShadow: isFront
          ? "0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)"
          : undefined,
      }}
      animate={{
        // Ensure the top card is always the largest paint candidate.
        scale: isFront ? 1 : Math.max(0.85, 0.94 - depth * 0.04),
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{
        left: -150,
        right: 150,
        top: 0,
        bottom: 0,
      }}
      onDragEnd={handleDragEnd}
    >
      {isFront ? (
        <ImageWithSkeleton
          src={url}
          alt="Photo of Mayank"
          width={175}
          height={233}
          sizes="175px"
          quality={75}
          draggable={false}
          containerClassName="h-full w-full pointer-events-none"
          className="h-full w-full select-none object-cover"
          fetchPriority="high"
          priority
        />
      ) : (
        <ImageWithSkeleton
          src={url}
          alt=""
          width={175}
          height={233}
          sizes="175px"
          quality={70}
          draggable={false}
          containerClassName="h-full w-full pointer-events-none"
          className="h-full w-full select-none object-cover"
          fetchPriority="low"
          loading="lazy"
        />
      )}
    </motion.div>
  );
};

export default SwipeCards;

type Card = {
  id: number;
  url: string;
};

const cardData: Card[] = [
  {
    id: 1,
    url: "/img/me-4.webp",
  },
  {
    id: 2,
    url: "/img/me-2.webp",
  },
  {
    id: 3,
    url: "/img/me-1.webp",
  },
  {
    id: 4,
    url: "/img/me-3.webp",
  },
];
