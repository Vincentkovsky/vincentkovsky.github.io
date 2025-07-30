import { Github, Linkedin, Mail, Youtube } from "lucide-react";
import avatar from "@/assets/avatar.png";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
        <div className="mb-8 relative">
          <div className="absolute inset-0 rounded-full gradient-border p-1 animate-pulse-slow">
            <div className="w-full h-full rounded-full bg-background"></div>
          </div>
          <img
            src={avatar}
            alt="Vincent Jin Profile Photo"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto object-cover relative z-10 hover-glow transition-all duration-300"
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-gradient">{t("hero.title")}</span>
        </h1>
        <p
          className="text-xl md:text-2xl text-muted-foreground mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {t("hero.subtitle")}
        </p>
        <p
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          {t("hero.description")}
        </p>
        <div
          className="flex justify-center space-x-6 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/Vincentkovsky"
            className="text-2xl text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125 hover-glow p-3 rounded-full"
          >
            <Github />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/wenzheng-jin/"
            className="text-2xl text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125 hover-glow p-3 rounded-full"
          >
            <Linkedin />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="mailto:vincent.jin6@icloud.com"
            className="text-2xl text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125 hover-glow p-3 rounded-full"
          >
            <Mail />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.youtube.com/@%E7%A9%BA%E8%85%B9%E5%88%B0%E5%BA%95%E8%83%BD%E4%B8%8D%E8%83%BD%E5%90%83%E9%A5%AD/videos"
            className="text-2xl text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-125 hover-glow p-3 rounded-full"
          >
            <Youtube />
          </a>
        </div>
      </div>
    </section>
  );
}
