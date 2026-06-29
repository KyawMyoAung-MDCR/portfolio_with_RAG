import { heroData } from '@/data/portfolioData';

export default function Hero() {
  return (
    <section className="py-20 text-center max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-100 sm:text-5xl">
        Hi, {"I'm"} <span className="text-blue-600">{heroData.name}</span>
      </h1>
      <p className="mt-4 text-xl font-medium text-gray-100">{heroData.title}</p>
      <p className="mt-4 text-base text-gray-100 leading-relaxed">{heroData.bio}</p>
    </section>
  );
}