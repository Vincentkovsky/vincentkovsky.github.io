import { GraduationCap, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Education() {
  const { t } = useTranslation();

  return (
    <section id="education" className="py-20 px-6 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center text-gradient flex items-center justify-center">
          <GraduationCap className="mr-3" />
          {t("education.title")}
        </h2>

        <div className="space-y-8">
          {/* Master's Degree */}
          <div
            className="flex items-start space-x-4 animate-fade-in-up"
            style={{ animationDelay: "0ms" }}
          >
            <div className="flex-shrink-0 w-4 h-4 bg-gradient-to-r from-primary to-blue-500 rounded-full mt-2 relative animate-pulse-slow">
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0.5 h-20 bg-gradient-to-b from-primary to-border" />
            </div>
            <div className="bg-card rounded-lg p-6 border border-border flex-1 hover:border-primary transition-all duration-300 card-hover-effect">
              <h3 className="text-xl font-bold text-gradient mb-2">
                {t("education.degrees.master.title")}
              </h3>
              <p className="text-muted-foreground font-medium mb-2">
                {t("education.degrees.master.university")}
              </p>
              <p className="text-sm text-primary/80 mb-3 font-mono">
                {t("education.degrees.master.period")} • {t("education.degrees.master.location")}
              </p>
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Award className="w-4 h-4 mr-2 text-yellow-500" />
                {t("education.degrees.master.scholarship")}
              </div>
            </div>
          </div>

          {/* Bachelor's Degree */}
          <div
            className="flex items-start space-x-4 animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex-shrink-0 w-4 h-4 bg-gradient-to-r from-primary to-blue-500 rounded-full mt-2 relative animate-pulse-slow"></div>
            <div className="bg-card rounded-lg p-6 border border-border flex-1 hover:border-primary transition-all duration-300 card-hover-effect">
              <h3 className="text-xl font-bold text-gradient mb-2">
                {t("education.degrees.bachelor.title")}
              </h3>
              <p className="text-muted-foreground font-medium mb-2">
                {t("education.degrees.bachelor.university")}
              </p>
              <p className="text-sm text-primary/80 mb-3 font-mono">
                {t("education.degrees.bachelor.period")} •{" "}
                {t("education.degrees.bachelor.location")}
              </p>
              <div className="space-y-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Award className="w-4 h-4 mr-2 text-yellow-500" />
                  {t("education.degrees.bachelor.scholarship")}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Award className="w-4 h-4 mr-2 text-blue-500" />
                  {t("education.degrees.bachelor.recommendation")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
