import { useEffect, useRef, useState } from "react";
import { Code, Wrench } from "lucide-react";
import {
  SiReact,
  SiNodedotjs,
  SiPython,
  SiGit,
  SiDocker,
  SiAmazonwebservices,
} from "react-icons/si";

interface Skill {
  name: string;
  percentage: number;
}

const technicalSkills: Skill[] = [
  { name: "JavaScript/TypeScript", percentage: 90 },
  { name: "React & Next.js", percentage: 85 },
  { name: "Node.js", percentage: 80 },
  { name: "Python", percentage: 75 },
  { name: "UX/UI Design", percentage: 70 },
];

export default function Skills() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Technical Skills */}
          <div className="bg-card rounded-xl p-8 border border-border card-hover-effect">
            <h3 className="text-2xl font-bold mb-8 text-gradient flex items-center">
              <Code className="mr-3" />
              Technical Skills
            </h3>
            <div className="space-y-6">
              {technicalSkills.map((skill, index) => (
                <div
                  key={skill.name}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-primary font-mono font-bold">{skill.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 relative overflow-hidden">
                    <div
                      className={`bg-gradient-to-r from-primary to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out ${
                        isVisible ? "animate-progress skill-bar-glow" : "w-0"
                      }`}
                      style={{
                        width: isVisible ? `${skill.percentage}%` : "0%",
                        animationDelay: `${index * 200}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tools & Technologies */}
          <div className="bg-card rounded-xl p-8 border border-border card-hover-effect">
            <h3 className="text-2xl font-bold mb-8 text-gradient flex items-center">
              <Wrench className="mr-3" />
              Tools & Technologies
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: SiReact, name: "React.js", color: "#61DAFB" },
                { icon: SiNodedotjs, name: "Node.js", color: "#339933" },
                { icon: SiPython, name: "Python", color: "#3776AB" },
                { icon: SiGit, name: "Git", color: "#F05032" },
                { icon: SiDocker, name: "Docker", color: "#2496ED" },
                { icon: SiAmazonwebservices, name: "AWS", color: "#FF9900" },
              ].map((tool, index) => (
                <div
                  key={tool.name}
                  className="bg-secondary rounded-lg p-4 text-center border border-border hover:border-primary transition-all duration-300 group hover-glow animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <tool.icon
                    className="text-3xl mb-2 mx-auto group-hover:scale-125 transition-transform duration-300 animate-pulse-slow"
                    style={{ color: tool.color }}
                  />
                  <p className="font-medium text-sm group-hover:text-primary transition-colors duration-300">
                    {tool.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
