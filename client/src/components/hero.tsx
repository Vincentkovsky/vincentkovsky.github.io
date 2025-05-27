import { Github, Linkedin, Mail } from "lucide-react";

export default function Hero() {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300"
            alt="Vincent Jin Profile Photo"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto object-cover border-4 border-primary shadow-2xl"
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Vincent <span className="text-primary">Jin</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-6">Software Developer & Engineer</p>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          I'm a software developer passionate about building personal projects and 
          exploring emerging technologies. I thrive on experimenting with AI-driven 
          solutions and using my real-world experience with crypto, always seeking to bridge 
          innovation with practical applications.
        </p>
        <div className="flex justify-center space-x-6">
          <a
            href="#"
            className="text-2xl text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <Github />
          </a>
          <a
            href="#"
            className="text-2xl text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <Linkedin />
          </a>
          <a
            href="#"
            className="text-2xl text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            <Mail />
          </a>
        </div>
      </div>
    </section>
  );
}
