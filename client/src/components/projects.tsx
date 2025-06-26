import { ExternalLink, Github, Laptop } from "lucide-react";
import { useTranslation } from "react-i18next";
import CregisRAG from "../assets/CregisRAG.png";
import anchor from "../assets/Anchor.png";
import flood from "../assets/flood.png";

export default function Projects() {
  const { t } = useTranslation();

  const projects = [
    {
      titleKey: "projects.items.flood.title",
      descriptionKey: "projects.items.flood.description",
      image: flood,
      tags: ["Vue 3", "TypeScript", "DeckGL", "FastAPI", "FloodTransformer"],
      github: "https://github.com/Vincentkovsky/SES_Fullstack_App",
      live: "#",
    },
    {
      titleKey: "projects.items.cregis.title",
      descriptionKey: "projects.items.cregis.description",
      image: CregisRAG,
      tags: ["Python", "JavaScript", "FastAPI", "Chroma", "LangChain"],
      github: "https://github.com/Vincentkovsky/CregisRAG",
      live: "#",
    },
    {
      titleKey: "projects.items.pressure.title",
      descriptionKey: "projects.items.pressure.description",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      tags: ["SwiftUI", "Cursor"],
      github: "https://github.com/Vincentkovsky/PressureSense",
      live: "#",
    },
    {
      titleKey: "projects.items.anchor.title",
      descriptionKey: "projects.items.anchor.description",
      image: anchor,
      tags: ["Swift", "SafariKit"],
      github: "https://github.com/Vincentkovsky/anchor",
      live: "https://www.youtube.com/watch?v=hjS4i4i0Lkg&ab_channel=%E7%A9%BA%E8%85%B9%E5%88%B0%E5%BA%95%E8%83%BD%E4%B8%8D%E8%83%BD%E5%90%83%E9%A5%AD",
    },
  ];

  return (
    <section id="projects" className="py-20 px-6 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <Laptop className="inline mr-3 text-primary" />
            {t("projects.title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("projects.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.titleKey}
              className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary transition-all duration-300 card-hover-effect group animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={`${t(project.titleKey)} Interface`}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 relative">
                <h3 className="text-xl font-bold mb-2 text-gradient group-hover:scale-105 transition-transform duration-200">
                  {t(project.titleKey)}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {t(project.descriptionKey)}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tag}
                        className="bg-gradient-to-r from-primary/20 to-blue-500/20 text-primary px-3 py-1 rounded-full text-sm font-medium hover:from-primary/30 hover:to-blue-500/30 transition-all duration-300 animate-fade-in-up"
                        style={{ animationDelay: `${index * 200 + tagIndex * 100}ms` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-3">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={project.github}
                      className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125 hover-glow p-2 rounded-full"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
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
