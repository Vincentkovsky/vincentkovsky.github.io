import { Briefcase, Globe } from "lucide-react";
import VisitorStats from "@/components/visitor-stats";

const experiences = [
  {
    title: "Full Stack Developer",
    company: "UTS",
    period: "2023 - Present",
    description:
      "Developed a real-time web-based flood visualization and prediction system using Vue 3, DeckGL, FastAPI, and FloodTransformer, achieving 80% faster tile loading and ultra-fast flood forecasting over an 800km2 area within 3 seconds.",
  },
  {
    title: "Full Stack Developer",
    company: "H2X",
    period: "2022 - 2023",
    description:
      "Contributed to full-stack development at H2X Engineering by implementing user and organization management features, resolving AWS-related bugs, building system validations and heatmap visualizations, and ensuring application correctness with end-to-end testing using Vue.js, Node.js, and AWS.",
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

          {/* Visitor Geography Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-gradient flex items-center">
              <Globe className="mr-3" />
              Visitor Geography
            </h2>
            {/* The VisitorStats component is now styled to match the design */}
            <VisitorStats />
          </div>
        </div>
      </div>
    </section>
  );
}
