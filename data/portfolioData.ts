// data/portfolioData.ts

export interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string[];
}

export interface Project {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
}

export interface uniProject {
  title: string;
  description: string;
  techStack: string[];
}

export const heroData = {
  name: "Kyaw Myo Aung",
  title: "Software Developer",
  bio: "Specializing in enterprise Java solutions, SAP S/4HANA infrastructure, and AI/ML model integration. Passionate about engineering deep learning models, computer vision applications, and bridging the gap between intelligent systems and clean, scalable web architectures.",
};

export const experiencesData: Experience[] = [
  {
    role: "Junior Developer",
    company: "Myanmmar DCR Co., Ltd.",
    duration: "2026 - Present",
    description: [
      "Developed enterprise Java applications and backend services during intensive company OJT training.",
      "Gained hands-on training and technical foundation in SAP S/4HANA Cloud systems and enterprise architecture.",
      "Explored the integration of intelligent workflows, bridging core software engineering with AI/ML capabilities."
    ]
  }
];

export const projectsData: Project[] = [
  {
    title: "AI-Powered Premium Developer Portfolio",
    description: "A futuristic, highly interactive developer portfolio built with Next.js and Tailwind CSS. It features professional animated page transitions via Framer Motion and an advanced AI chatbot assistant integrated with a custom Supabase pgvector RAG engine for semantic resume parsing and dynamic chat memory tracking.",
    techStack: ["Next.js", "Tailwind CSS", "TypeScript", "Gemini API"],
    githubUrl: "https://github.com/KyawMyoAung-MDCR/my-portfolio"
  }
];

export const universityProjectsData: uniProject[] = [
  {
    title: "Alert System for Restricted Area using YOLOv8",
    description: "Developed an automated surveillance solution using Python, YOLOv8, and OpenCV to detect unauthorized personnel entering restricted zones in real-time and trigger instant system alerts.",
    techStack: ["Python", "OpenCV", "Yolov8", "Flask Web Framework"],
  }
];

export const skillsData: string[] = [
  "Python", "SAP/S4HANA", "Java", "TypeScript", "JavaScript", "Next.js", "SQL", "C++"
];


export const aboutMeData = {
  text: "I am a Junior Developer at MyanmarDCR Co., Ltd., with a strong foundation in Java development and hands-on training in SAP S/4HANA. I graduated from the University of Technology (Yatanarpon Cyber City), where I specialized in Machine Learning and Deep Learning. Driven by a deep passion for AI model training and development, I built an automated alert system for restricted areas using YOLOv8 for my graduation thesis. I am eager to bridge the gap between enterprise software engineering and advanced AI solutions.",
  email: "kyawmyoaung@myanmardcr.com", 
  university: "University of Technology (Yatanapon Cybercity)", 
  degree : "Bachelor of Engineering (B.E.IST)",
  thesis: "Development of AI-Powered automated surveillance solution using Python, YOLOv8, and OpenCV to detect unauthorized personnel entering restricted zones in real-time and trigger instant system alerts.", 
  languages: ["Japanese (N4), English (intermediate)"] 
};