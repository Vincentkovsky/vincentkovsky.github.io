import { Briefcase, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import VisitorStats from "@/components/visitor-stats";

export default function Experience() {
  const { t } = useTranslation();

  return (
    <section id="experience" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Experience Timeline */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-gradient flex items-center">
              <Briefcase className="mr-3" />
              {t("experience.title")}
            </h2>
            <div className="space-y-8">
              {/* UTS Experience */}
              <div
                className="flex items-start space-x-4 animate-fade-in-up"
                style={{ animationDelay: "0ms" }}
              >
                <div className="flex-shrink-0 w-4 h-4 bg-gradient-to-r from-primary to-blue-500 rounded-full mt-2 relative animate-pulse-slow">
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-primary to-border" />
                </div>
                <div className="bg-card rounded-lg p-6 border border-border flex-1 hover:border-primary transition-all duration-300 card-hover-effect">
                  <h3 className="text-xl font-bold text-gradient">
                    {t("experience.jobs.fullstack_uts.title")}
                  </h3>
                  <p className="text-muted-foreground font-medium mb-2">
                    {t("experience.jobs.fullstack_uts.company")}
                  </p>
                  <p className="text-sm text-primary/80 mb-3 font-mono">
                    {t("experience.jobs.fullstack_uts.period")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("experience.jobs.fullstack_uts.description")}
                  </p>
                </div>
              </div>

              {/* H2X Experience */}
              <div
                className="flex items-start space-x-4 animate-fade-in-up"
                style={{ animationDelay: "200ms" }}
              >
                <div className="flex-shrink-0 w-4 h-4 bg-gradient-to-r from-primary to-blue-500 rounded-full mt-2 relative animate-pulse-slow"></div>
                <div className="bg-card rounded-lg p-6 border border-border flex-1 hover:border-primary transition-all duration-300 card-hover-effect">
                  <h3 className="text-xl font-bold text-gradient">
                    {t("experience.jobs.fullstack_h2x.title")}
                  </h3>
                  <p className="text-muted-foreground font-medium mb-2">
                    {t("experience.jobs.fullstack_h2x.company")}
                  </p>
                  <p className="text-sm text-primary/80 mb-3 font-mono">
                    {t("experience.jobs.fullstack_h2x.period")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {t("experience.jobs.fullstack_h2x.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visitor Geography Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-gradient flex items-center">
              <Globe className="mr-3" />
              {t("experience.visitor")}
            </h2>
            {/* The VisitorStats component is now styled to match the design */}
            <VisitorStats />
          </div>
        </div>
      </div>
    </section>
  );
}
