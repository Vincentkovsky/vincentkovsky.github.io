import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import Skills from "@/components/skills";
import Projects from "@/components/projects";
import Experience from "@/components/experience";
import Contact from "@/components/contact";
import { useTranslation } from "react-i18next";

export default function Portfolio() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">{t("footer.rights")}</p>
          <p className="text-sm text-muted-foreground">{t("footer.built")}</p>
        </div>
      </footer>
    </div>
  );
}
