import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState } from "react";
import AnimatedContent from "@/components/AnimatedContent";
import StarBorder from "./StarBorder";

const projects = [
  {
    title: "Snacking Behavior in Dutch Millennials",
    description:
      "Investigating snacking behavior by analyzing food diary data through machine learning association rule mining.",
    date: "July 2024",
    type: "Research",
    detailTitle:
      "Examining Snacking Behavior With Food Diaries And Data Mining Methods",
    detail:
      "This study investigates snacking behavior by analyzing food diary data from Dutch Millennials through data mining methods such as topic modeling and association rule mining.",
    link: "https://www.wur.nl/nl/onderzoek-resultaten/leerstoelgroepen/agrotechnologie-en-voedselwetenschappen/levensmiddelentechnologie/food-quality-and-design-1/foodloop/het-foodloop-onderzoek.htm",
  },
  {
    title: "Sustainable Product-Service Systems",
    description:
      "Focusing on the transition to Product-Service Systems to promote circular economy principles.",
    date: "January 2024",
    type: "Research",
    detailTitle: "Logitech: Sustainable Product-Service System Design",
    detail:
      "The focus of this project is on the transition from current models of Logitech G racing sim gears to Product-Service Systems (PSS) to promote circular economy principles.",
    link: "https://e4s.center/transformative-project/logitech-business-model-innovation-for-high-tech-consumer-goods/",
  },
  {
    title: "Knowledge Demands in Q&A Community",
    description:
      "Analyzing UGC data to reveal the characteristics and knowledge demands of users in different topics.",
    date: "June 2022",
    type: "Research",
    detailTitle:
      "Research On Answer Characteristics And User Knowledge Demands Of Social Q&A Community",
    detail:
      "This research conducted statistical and sentiment analysis of characteristic indicators of answers under distinct topics, to reveal basic characteristic difference, and utilized social network analysis and text clustering to analyze the co-occurrence characteristics of high-frequency words and the correlation between users' sentiment tendencies and high-frequency words. The thesis is awarded the outstanding thesis of the cohort.",
    link: "https://github.com/ZihaoWang2000/Zhihu_Crawler_Analysis",
  },
  {
    title: "User Behavior on ResearchGate",
    description:
      "Studying user behavior in different types of institutions on ResearchGate to understand engagement.",
    date: "January 2022",
    type: "Research",
    detailTitle:
      "Research On The User Behavior In Academic Social Networking Sites",
    detail:
      "This study shortlisted the top 5 institutions in industry, university and research field respectively that were released by Nature Index as the research objects with the extracted data from ResearchGate, in order to study the user behavior (questioning and answering) in academic social networking sites.",
    link: "https://www.emerald.com/insight/content/doi/10.1108/ajim-05-2021-0141/full/html",
  },
  {
    title: "A Price Comparison WeChat Mini-App",
    description:
      "Building a cosmetic price comparison project covering product search, price comparison, and historical price trends.",
    date: "June 2021",
    type: "Development",
    detailTitle: "Bizhuang: A Cosmetics Price Comparison WeChat Mini-App",
    detail:
      "This platform covers the main functions of user registration, products searching, comparison of the similar products' prices across the entire network, and visualization of the historical price of a product, etc.",
    link: "https://github.com/ZihaoWang2000/WechatMiniprogram",
  },
];

export default function Projects() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacityIn = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const opacityOut = useTransform(scrollYProgress, [0.5, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.5, 1], [1, 0.85]);
  const y = useTransform(scrollYProgress, [0.5, 1], [0, -100]);
  const combinedOpacity = useTransform(
    [opacityIn, opacityOut],
    ([a, b]) => a * b
  );

  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      className="min-h-screen bg-black text-white px-6 py-24 overflow-hidden"
    >
      <motion.div
        style={{ y, scale, opacity: combinedOpacity }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">Projects</h2>
          <p className="text-lg text-gray-400 mt-4">
            Selected work at the intersection of research and practice.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <AnimatedContent
              key={index}
              direction="vertical"
              distance={60}
              delay={index * 100}
              repeat
            >
              <div
                onClick={() => setSelectedProject(index)}
                className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition backdrop-blur-sm shadow-lg cursor-pointer"
              >
                <h3 className="text-2xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-300">{project.description}</p>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedProject !== null && (
          <motion.div
            key="modal"
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            onClick={() => setSelectedProject(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnimatedContent direction="vertical" distance={60} delay={0}>
              <div
                className="bg-zinc-900 text-white rounded-xl p-6 max-w-3xl w-full relative max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-2 right-2 text-white hover:text-gray-300"
                >
                  ✕
                </button>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {projects[selectedProject].detailTitle}
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm mb-4 text-center">
                  <div>
                    <div className="font-semibold before:content-['📅'] before:mr-2">
                      {projects[selectedProject].date}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold before:content-['📄'] before:mr-2">
                      {projects[selectedProject].type}
                    </div>
                  </div>
                  <div>
                    <a
                      href={projects[selectedProject].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-400 hover:underline before:content-['🔗'] before:mr-2"
                    >
                      View this Project
                    </a>
                  </div>
                </div>
                <p className="text-gray-200">
                  {projects[selectedProject].detail}
                </p>
              </div>
            </AnimatedContent>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
