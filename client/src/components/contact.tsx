import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MapPin, Send, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createContactSubmission } from "@/lib/firebaseService";
import { useTranslation } from "react-i18next";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return createContactSubmission(data);
    },
    onSuccess: () => {
      toast({
        title: t("contact.form.success"),
        description: t("contact.form.success_description"),
      });
      reset();
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      toast({
        title: t("contact.form.error"),
        description: error.message || t("contact.form.error_description"),
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    contactMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 px-6 bg-secondary">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <Send className="inline mr-3 text-primary" />
            {t("contact.title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("contact.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card rounded-xl p-8 border border-border card-hover-effect">
            <h3 className="text-2xl font-bold mb-6 text-gradient">{t("contact.form.title")}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="animate-fade-in-up">
                <label className="block text-sm font-medium mb-2">{t("contact.form.name")}</label>
                <Input
                  {...register("name")}
                  placeholder={t("contact.form.name_placeholder")}
                  className="bg-secondary border-border focus:border-primary hover-glow transition-all duration-300"
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <label className="block text-sm font-medium mb-2">{t("contact.form.email")}</label>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder={t("contact.form.email_placeholder")}
                  className="bg-secondary border-border focus:border-primary hover-glow transition-all duration-300"
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <label className="block text-sm font-medium mb-2">
                  {t("contact.form.message")}
                </label>
                <Textarea
                  {...register("message")}
                  rows={5}
                  placeholder={t("contact.form.message_placeholder")}
                  className="bg-secondary border-border focus:border-primary resize-none hover-glow transition-all duration-300"
                />
                {errors.message && (
                  <p className="text-destructive text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-primary-foreground font-semibold py-3 transition-all duration-300 hover:scale-105 hover-glow animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
                {isSubmitting ? t("contact.form.submitting") : t("contact.form.submit")}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-card rounded-xl p-8 border border-border card-hover-effect">
              <h3 className="text-2xl font-bold mb-6 text-gradient">{t("contact.info.title")}</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-300 hover-glow animate-fade-in-up">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-blue-500 rounded-lg flex items-center justify-center animate-pulse-slow">
                    <Mail className="text-primary-foreground text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-gradient">{t("contact.info.email")}</p>
                    <p className="text-muted-foreground hover:text-primary transition-colors duration-300">
                      vincent.jin@icloud.com
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-300 hover-glow animate-fade-in-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-blue-500 rounded-lg flex items-center justify-center animate-pulse-slow">
                    <MapPin className="text-primary-foreground text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-gradient">{t("contact.info.location")}</p>
                    <p className="text-muted-foreground hover:text-primary transition-colors duration-300">
                      {t("contact.info.location_value")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border card-hover-effect">
              <h3 className="text-xl font-bold mb-6 text-gradient">{t("contact.info.follow")}</h3>
              <div className="flex space-x-4">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/Vincentkovsky"
                  className="w-12 h-12 bg-secondary hover:bg-gradient-to-r hover:from-primary hover:to-blue-500 border border-border hover:border-primary rounded-lg flex items-center justify-center transition-all duration-300 group hover:scale-110 hover-glow animate-fade-in-up"
                >
                  <Github className="text-xl group-hover:text-primary-foreground transition-colors duration-300" />
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.linkedin.com/in/wenzheng-jin/"
                  className="w-12 h-12 bg-secondary hover:bg-gradient-to-r hover:from-primary hover:to-blue-500 border border-border hover:border-primary rounded-lg flex items-center justify-center transition-all duration-300 group hover:scale-110 hover-glow animate-fade-in-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  <Linkedin className="text-xl group-hover:text-primary-foreground transition-colors duration-300" />
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://x.com/crypto_kk3"
                  className="w-12 h-12 bg-secondary hover:bg-gradient-to-r hover:from-primary hover:to-blue-500 border border-border hover:border-primary rounded-lg flex items-center justify-center transition-all duration-300 group hover:scale-110 hover-glow animate-fade-in-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <Twitter className="text-xl group-hover:text-primary-foreground transition-colors duration-300" />
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="mailto:vincent.jin6@icloud.com"
                  className="w-12 h-12 bg-secondary hover:bg-gradient-to-r hover:from-primary hover:to-blue-500 border border-border hover:border-primary rounded-lg flex items-center justify-center transition-all duration-300 group hover:scale-110 hover-glow animate-fade-in-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  <Mail className="text-xl group-hover:text-primary-foreground transition-colors duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
