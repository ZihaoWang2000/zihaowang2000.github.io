import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ProfileCard from "../components/ProfileCard";

export default function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // 入场淡入
  const opacityIn = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // 离场缩放+淡出+上浮
  const opacityOut = useTransform(scrollYProgress, [0.5, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.5, 1], [1, 0.85]);
  const y = useTransform(scrollYProgress, [0.5, 1], [0, -100]);

  const combinedOpacity = useTransform(
    [opacityIn, opacityOut],
    ([a, b]: [number, number]) => a * b
  );

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 bg-zinc-900 text-white overflow-hidden"
    >
      <motion.div
        style={{ y, scale, opacity: combinedOpacity }}
        className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-12"
      >
        <div className="max-w-3xl text-center space-y-6 mr-12">
          <h2 className="text-4xl md:text-5xl font-bold">About Me</h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            Hi there! I'm currently an intern at IATA ✈️ with a master's degree
            in EPFL, UNIL-HEC and IMD. I'm equipped with knowledge about
            technology and management and am very interested in human-centered
            technology and socia science. I'm a hardworking guy when it comes to
            study and research, and have always got enthusiam for the future.
            Day Dreamer could be possibly suitable to describe me, but those
            dreams are in the meanwhile motivating me to be better, and I
            believe I will realize them at last.
          </p>
        </div>
        <ProfileCard
          name="Zihao"
          title="Intern at IATA ✈️"
          handle="wzhelliott"
          status="Online"
          contactText="Contact Me"
          avatarUrl="sticker.png"
          showUserInfo={true}
          enableTilt={true}
          showBehindGradient={true}
          onContactClick={() => console.log("Contact clicked")}
        />
      </motion.div>
    </section>
  );
}
