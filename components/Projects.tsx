import { projectsData, skillsData } from '@/data/portfolioData';

export default function Projects() {
  return (
    <section className="py-12 border-t border-gray-200">
      {/* Skills Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-blue-500 mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skillsData.map((skill) => (
            <span key={skill} className="px-3 py-1 text-blue-500 text-gray-100 text-sm font-medium rounded-full border">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div>
        <h2 className="text-2xl font-bold text-blue-500 mb-6">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectsData.map((project, idx) => (
            <div key={idx} className="p-6 bg-white rounded-xl border text-gray-900 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                <p className="mt-2 text-sm text-gray-900 leading-relaxed">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              {project.githubUrl && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <a
                    href={project.githubUrl}
                    target="_blank"         
                    rel="noopener noreferrer" 
                    className="inline-flex items-center text-sm font-medium text-blue-500 hover:text-blue-800 hover:underline gap-1"
                  >
                    View on GitHub →
                  </a>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}