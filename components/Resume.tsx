import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const experience = [
  {
    title: "Training Technology Intern – IATA",
    period: "2024.10 – Present",
    location: "Geneva, Switzerland",
    description:
      "Administrating Training systems and troubleshooting issues to support daily operations.",
  },
  // {
  //   title: "Research Intern – IDIAP Research Institute",
  //   period: "2024.02 – 2024.07",
  //   location: "Lausanne, Switzerland",
  //   description:
  //     "Investigated snacking behavior by analyzing food diary data from Dutch Millennials.",
  // },
  {
    title: "Consulting Intern – Kincentric (Spencer Stuart)",
    period: "2021.12 – 2022.03",
    location: "Guangzhou, China",
    description:
      "Conducted employee engagement data analysis and maintained data accuracy.",
  },
  // {
  //   title: "Research Assistant – Wuhan University",
  //   period: "2020.09 – 2022.03",
  //   location: "Wuhan, China",
  //   description:
  //     "Studied the user behavior on ResearchGate and co-authored two papers.",
  // },
  {
    title: "Business Analysis Intern – JD.com",
    period: "2021.06 – 2021.09",
    location: "Wuhan, China",
    description:
      "Provided daily data support for business departments such as SQL queries and BI platforms.",
  },
];

const education = [
  {
    title: "Master of Science in Sustainable Management and Technology",
    period: "2022 – 2024",
    location: "École Polytechnique Fédérale de Lausanne (EPFL)",
    description:
      "Core Courses: Data science and machine learning, Digitalization and sustainable logistics, Science of climate change, Sustainability accounting, Robotics for society",
  },
  {
    title: "Bachelor of Science in Electronic Commerce",
    period: "2018 – 2022",
    location: "Wuhan University",
    description:
      "Core Courses: Information system design, Business intelligence, Web development, Social network analysis, Computer network",
  },
];

export default function Resume() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [-100, 0]);

  return (
    <section
      ref={ref}
      className="min-h-screen bg-zinc-900 text-white px-6 py-24 overflow-hidden"
    >
      <motion.div
        style={{ opacity, scale, y }}
        // @ts-ignore
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">Resume</h2>
          <p className="text-lg text-gray-400 mt-4">
            A brief overview of my academic and professional journey.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-2xl font-bold mb-6">Experience</h3>
            <div className="space-y-10 border-l border-white/20 pl-6">
              {experience.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ amount: 0.3 }}
                  // @ts-ignore
                  className="relative"
                >
                  <div className="absolute left-[-1rem] top-2 w-3 h-3 bg-white rounded-full shadow-md" />
                  <h4 className="text-xl font-semibold">{item.title}</h4>
                  <p className="text-gray-400 text-sm">
                    {item.period} · {item.location}
                  </p>
                  <p className="text-gray-300 mt-2">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6">Education</h3>
            <div className="space-y-10 border-l border-white/20 pl-6">
              {education.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ amount: 0.3 }}
                  // @ts-ignore
                  className="relative"
                >
                  <div className="absolute left-[-1rem] top-2 w-3 h-3 bg-white rounded-full shadow-md" />
                  <h4 className="text-xl font-semibold">{item.title}</h4>
                  <p className="text-gray-400 text-sm">
                    {item.period} · {item.location}
                  </p>
                  <p className="text-gray-300 mt-2">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
