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

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        title: "Message sent successfully!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      reset();
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later.",
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
            Get In Touch
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            I'm always open to discussing new opportunities, interesting projects, or just having a
            friendly chat about technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card rounded-xl p-8 border border-border card-hover-effect">
            <h3 className="text-2xl font-bold mb-6 text-gradient">Send Message</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="animate-fade-in-up">
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  {...register("name")}
                  placeholder="Your name"
                  className="bg-secondary border-border focus:border-primary hover-glow transition-all duration-300"
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="your@email.com"
                  className="bg-secondary border-border focus:border-primary hover-glow transition-all duration-300"
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  {...register("message")}
                  rows={5}
                  placeholder="Your message..."
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
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-card rounded-xl p-8 border border-border card-hover-effect">
              <h3 className="text-2xl font-bold mb-6 text-gradient">Or Reach Via</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-all duration-300 hover-glow animate-fade-in-up">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-blue-500 rounded-lg flex items-center justify-center animate-pulse-slow">
                    <Mail className="text-primary-foreground text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-gradient">Email</p>
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
                    <p className="font-semibold text-gradient">Location</p>
                    <p className="text-muted-foreground hover:text-primary transition-colors duration-300">
                      China
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border card-hover-effect">
              <h3 className="text-xl font-bold mb-6 text-gradient">Follow Me</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-secondary hover:bg-gradient-to-r hover:from-primary hover:to-blue-500 border border-border hover:border-primary rounded-lg flex items-center justify-center transition-all duration-300 group hover:scale-110 hover-glow animate-fade-in-up"
                >
                  <Github className="text-xl group-hover:text-primary-foreground transition-colors duration-300" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-secondary hover:bg-gradient-to-r hover:from-primary hover:to-blue-500 border border-border hover:border-primary rounded-lg flex items-center justify-center transition-all duration-300 group hover:scale-110 hover-glow animate-fade-in-up"
                  style={{ animationDelay: "0.1s" }}
                >
                  <Linkedin className="text-xl group-hover:text-primary-foreground transition-colors duration-300" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-secondary hover:bg-gradient-to-r hover:from-primary hover:to-blue-500 border border-border hover:border-primary rounded-lg flex items-center justify-center transition-all duration-300 group hover:scale-110 hover-glow animate-fade-in-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  <Twitter className="text-xl group-hover:text-primary-foreground transition-colors duration-300" />
                </a>
                <a
                  href="#"
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
