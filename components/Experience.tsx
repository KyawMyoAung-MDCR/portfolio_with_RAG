import { experiencesData } from '@/data/portfolioData';

export default function Experience() {
  return (
    <section className="py-12 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-100 mb-8">Work Experience</h2>
      <div className="space-y-12">
        {experiencesData.map((exp, idx) => (
          <div key={idx} className="flex flex-col md:flex-row md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold text-gray-100">{exp.role}</h3>
              <p className="text-md text-blue-600 font-medium">{exp.company}</p>
              <ul className="mt-3 list-disc list-inside text-gray-100 space-y-1 text-sm">
                {exp.description.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <span className="text-sm text-gray-100 whitespace-nowrap">{exp.duration}</span>
          </div>
        ))}
      </div>
    </section>
  );
}