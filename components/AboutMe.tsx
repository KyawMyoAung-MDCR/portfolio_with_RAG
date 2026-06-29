// components/AboutMe.tsx
import { aboutMeData } from '@/data/portfolioData';

export default function AboutMe() {
  return (
    <section className="py-12 border-t border-gray-200 animate-fadeIn">
      <h2 className="text-2xl font-bold text-blue-500 mb-6">About Me</h2>
      <p className="text-gray-100 leading-relaxed text-base">{aboutMeData.text}</p>
    </section>
  );
}