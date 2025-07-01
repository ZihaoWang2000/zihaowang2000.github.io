import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Particles from "@/components/Particles";
import TrueFocus from "./TrueFocus";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // 出现时 = 元素底部进入视口；离开时 = 顶部离开视口
  });

  // 第一阶段：入场淡入（从 0 → 0.3）
  const opacityIn = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // 第二阶段：离场缩小 + 上浮 + 淡出（从 0.3 → 1）
  const opacityOut = useTransform(scrollYProgress, [0.5, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.5, 1], [1, 0.85]);
  const y = useTransform(scrollYProgress, [0.5, 1], [0, -100]);

  // 混合两个阶段的透明度
  const combinedOpacity = useTransform(
    [opacityIn, opacityOut],
    ([a, b]) => a * b
  );

  return (
    <section
      ref={ref}
      className="relative h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
    >
      <motion.div
        style={{ y, scale, opacity: combinedOpacity }}
        className="z-10 space-y-6"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          <TrueFocus
            sentence="Zihao Elliott"
            manualMode={true}
            blurAmount={5}
            borderColor="red"
            animationDuration={1}
            pauseBetweenAnimations={1}
          />
          {/* Zihao */}
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl">
          Graduate at École Polytechnique Fédérale de Lausanne (EPFL)
        </p>
        <button
          onClick={() =>
            window.scrollTo({
              top: window.innerHeight * 2,
              behavior: "smooth",
            })
          }
          className="mt-10 px-6 py-3 text-lg font-medium border border-white rounded-full hover:bg-white hover:text-black transition backdrop-blur-md bg-white/10"
        >
          View My Work
        </button>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-black to-black opacity-80 z-0" />
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          sizeRandomness={0.2}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
    </section>
  );
}
