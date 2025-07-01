import { useRef, useEffect, useState, ReactNode } from "react";
import { useSpring, animated, SpringConfig } from "@react-spring/web";

interface AnimatedContentProps {
  children: ReactNode;
  distance?: number;
  direction?: "vertical" | "horizontal";
  reverse?: boolean;
  config?: SpringConfig;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  repeat?: boolean;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  distance = 100,
  direction = "vertical",
  reverse = false,
  config = { tension: 50, friction: 25 },
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  repeat = false,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const directions: Record<"vertical" | "horizontal", string> = {
    vertical: "Y",
    horizontal: "X",
  };

  const [springProps, api] = useSpring(() => ({
    from: {
      transform: `translate${directions[direction]}(${
        reverse ? `-${distance}px` : `${distance}px`
      }) scale(${scale})`,
      opacity: animateOpacity ? initialOpacity : 1,
    },
    config,
  }));

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (repeat || !inView) {
            setTimeout(() => {
              setInView(true);
              api.start({
                to: {
                  transform: `translate${directions[direction]}(0px) scale(1)`,
                  opacity: 1,
                },
              });
            }, delay);
          }
        } else if (repeat) {
          setInView(false);
          api.start({
            to: {
              transform: `translate${directions[direction]}(${
                reverse ? `-${distance}px` : `${distance}px`
              }) scale(${scale})`,
              opacity: animateOpacity ? initialOpacity : 1,
            },
          });
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [
    threshold,
    delay,
    repeat,
    inView,
    directions,
    direction,
    distance,
    reverse,
    scale,
    animateOpacity,
    api,
  ]);

  return (
    <animated.div ref={ref} style={springProps}>
      {children}
    </animated.div>
  );
};

export default AnimatedContent;
