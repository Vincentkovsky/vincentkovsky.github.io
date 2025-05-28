import { Briefcase, Globe } from "lucide-react";
import VisitorStats from "./visitor-stats";

const experiences = [
  {
    title: "Senior Frontend Developer",
    company: "Tech Innovations",
    period: "2022 - Present",
    description:
      "Led front-end development of modern web applications using React and TypeScript. Collaborated closely with design and backend teams to deliver high-performance, user-centric solutions.",
  },
  {
    title: "Full Stack Developer",
    company: "Digital Solutions",
    period: "2020 - 2022",
    description:
      "Built and maintained web applications using Node.js, Express, and React. Implemented RESTful APIs and managed database schemas for optimal performance.",
  },
  {
    title: "Junior Developer",
    company: "StartupCo",
    period: "2019 - 2020",
    description:
      "Contributed to frontend development using HTML, CSS, and JavaScript. Gained valuable experience in responsive design and cross-browser compatibility.",
  },
  {
    title: "Web Development Intern",
    company: "Local Agency",
    period: "2018 - 2019",
    description:
      "Assisted in the development of responsive websites for clients. Learned about modern web development practices and client communication.",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Experience Timeline */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-gradient flex items-center">
              <Briefcase className="mr-3" />
              Experience Timeline
            </h2>
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div
                  key={exp.title}
                  className="flex items-start space-x-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex-shrink-0 w-4 h-4 bg-gradient-to-r from-primary to-blue-500 rounded-full mt-2 relative animate-pulse-slow">
                    {index < experiences.length - 1 && (
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-primary to-border" />
                    )}
                  </div>
                  <div className="bg-card rounded-lg p-6 border border-border flex-1 hover:border-primary transition-all duration-300 card-hover-effect">
                    <h3 className="text-xl font-bold text-gradient">{exp.title}</h3>
                    <p className="text-muted-foreground font-medium mb-2">{exp.company}</p>
                    <p className="text-sm text-primary/80 mb-3 font-mono">{exp.period}</p>
                    <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actual Visitor Stats Component */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-gradient flex items-center">
              <Globe className="mr-3" />
              Visitor Geography
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-background px-3 py-1 rounded-full text-sm font-medium ml-3 animate-pulse-slow">
                Featured
              </span>
            </h2>
            <div className="bg-card rounded-xl p-6 border border-border card-hover-effect">
              <VisitorStats isEmbedded={true} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
