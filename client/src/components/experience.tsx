import { Briefcase, Globe, MapPin } from "lucide-react";

const experiences = [
  {
    title: "Senior Frontend Developer",
    company: "Tech Innovations",
    period: "2022 - Present",
    description: "Led front-end development of modern web applications using React and TypeScript. Collaborated closely with design and backend teams to deliver high-performance, user-centric solutions.",
  },
  {
    title: "Full Stack Developer",
    company: "Digital Solutions",
    period: "2020 - 2022",
    description: "Built and maintained web applications using Node.js, Express, and React. Implemented RESTful APIs and managed database schemas for optimal performance.",
  },
  {
    title: "Junior Developer",
    company: "StartupCo",
    period: "2019 - 2020",
    description: "Contributed to frontend development using HTML, CSS, and JavaScript. Gained valuable experience in responsive design and cross-browser compatibility.",
  },
  {
    title: "Web Development Intern",
    company: "Local Agency",
    period: "2018 - 2019",
    description: "Assisted in the development of responsive websites for clients. Learned about modern web development practices and client communication.",
  },
];

const visitorStats = [
  { location: "Hong Kong, Hong Kong SAR", percentage: "28.5%", color: "bg-primary" },
  { location: "Singapore, Singapore", percentage: "24.1%", color: "bg-blue-500" },
  { location: "Amsterdam, The Netherlands", percentage: "19.3%", color: "bg-yellow-500" },
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Experience Timeline */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-primary flex items-center">
              <Briefcase className="mr-3" />
              Experience Timeline
            </h2>
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div key={exp.title} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-4 h-4 bg-primary rounded-full mt-2 relative">
                    {index < experiences.length - 1 && (
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-border" />
                    )}
                  </div>
                  <div className="bg-card rounded-lg p-6 border border-border flex-1 hover:border-primary transition-colors duration-300">
                    <h3 className="text-xl font-bold text-primary">{exp.title}</h3>
                    <p className="text-muted-foreground font-medium mb-2">{exp.company}</p>
                    <p className="text-sm text-muted-foreground mb-3">{exp.period}</p>
                    <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visitor Geography Widget */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-primary flex items-center">
              <Globe className="mr-3" />
              Visitor Geography
              <span className="bg-orange-500 text-background px-2 py-1 rounded text-sm font-medium ml-3">
                Featured
              </span>
            </h2>
            <div className="bg-card rounded-xl p-6 border border-border">
              {/* Map Widget Mockup */}
              <div className="bg-secondary rounded-lg p-4 mb-6 h-64 flex items-center justify-center relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519302959554-a75be0afc82a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
                  alt="Interactive world map showing visitor statistics"
                  className="w-full h-full object-cover rounded opacity-80"
                />
                {/* Overlay indicators */}
                <div className="absolute inset-0">
                  <div className="absolute top-16 left-20 w-3 h-3 bg-primary rounded-full animate-pulse" />
                  <div className="absolute top-24 left-32 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  <div className="absolute top-20 right-24 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold mb-4">Top Visitor Locations</h4>
                <div className="space-y-3">
                  {visitorStats.map((stat) => (
                    <div key={stat.location} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 ${stat.color} rounded-full`} />
                        <span className="text-sm">{stat.location}</span>
                      </div>
                      <span className="text-primary font-mono font-semibold text-sm">
                        {stat.percentage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-muted-foreground text-sm flex items-center">
                  <MapPin className="mr-2 text-primary w-4 h-4" />
                  Based in: <span className="text-primary ml-1">China</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
