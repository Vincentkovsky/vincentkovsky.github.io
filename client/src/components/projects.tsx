import { ExternalLink, Github, Laptop } from "lucide-react";

const projects = [
  {
    title: "Resume Builder",
    description: "A comprehensive web app featuring professional resume templates with customizable layouts and real-time preview functionality.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    tags: ["React", "TypeScript", "Tailwind"],
    github: "#",
    live: "#",
  },
  {
    title: "Code Analyzer",
    description: "Smart tool for analyzing code repositories to identify patterns, potential bugs, and improvement opportunities using machine learning.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    tags: ["Python", "Machine Learning", "FastAPI"],
    github: "#",
    live: "#",
  },
  {
    title: "Business Dashboard",
    description: "A comprehensive dashboard for monitoring smart home devices with React and TypeScript, featuring real-time data visualization.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    tags: ["React", "D3.js", "WebSocket"],
    github: "#",
    live: "#",
  },
  {
    title: "E-Commerce Platform",
    description: "A full-featured online store with product management, payment processing, and order tracking capabilities built with modern technologies.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    tags: ["Next.js", "Stripe", "MongoDB"],
    github: "#",
    live: "#",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 px-6 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <Laptop className="inline mr-3 text-primary" />
            Featured Projects
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A showcase of my recent work spanning web applications, tools, and creative experiments
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary transition-all duration-300 card-hover-effect group animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={`${project.title} Interface`}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 relative">
                <h3 className="text-xl font-bold mb-2 text-gradient group-hover:scale-105 transition-transform duration-200">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tag}
                        className="bg-gradient-to-r from-primary/20 to-blue-500/20 text-primary px-3 py-1 rounded-full text-sm font-medium hover:from-primary/30 hover:to-blue-500/30 transition-all duration-300 animate-fade-in-up"
                        style={{ animationDelay: `${(index * 200) + (tagIndex * 100)}ms` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-3">
                    <a
                      href={project.github}
                      className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125 hover-glow p-2 rounded-full"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href={project.live}
                      className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125 hover-glow p-2 rounded-full"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
