import NoblisLogo from '../assets/noblis_logo_dark_mode.png';
import BULogo from '../assets/BU_logo.png';
import StateDeptLogo from '../assets/state_dept_logo.png';

const experiences = [
  {
    company: 'Noblis',
    logo: NoblisLogo,
    roles: [
      {
        title: 'Machine Learning Engineer',
        duration: 'June 2024 - Present',
        description: [
          'Led project implementing ViT for climate predictions leading to NOAA contract',
          'Developed full-stack LLM chatbot, fine-tuned LLaMA 3.1, and deployed in production on client hardware',
          'Technical director for our LLM lab, managing new employees and upskilling developers to leverage LLMs in workflows across NRO, NASA, IRS, and other clients, resulting in increased automation',
        ],
      },
      {
        title: 'Principal Investigator',
        duration: 'September 2022 - Present',
        description: [
          'Led research leveraging ML for malware attribution, presented results to C-suite and external clients',
          'Designed and implemented improved vision transformer architectures in PyTorch for meteorological predictions',
          'Authored CVPR 2024 submission advancing multimodal object detection for computer vision',
        ],
      },
      {
        title: 'Machine Learning Research Intern',
        duration: 'June 2022 - September 2022',
        description: [
          'Optimized Python object detection pipeline for orchestrated networks of autonomous vehicles, reduced bandwidth usage by 87%',
        ],
      },
    ],
  },
  {
    company: 'Boston University',
    logo: BULogo,
    roles: [
      {
        title: 'TA for ENG EC500, Software at Scale',
        duration: 'September 2022 - December 2022',
        description: [
          'Led tutorials and lectures in C++ and JavaScript',
          'Developed unit tests for assignments',
          'Managed graders',
        ],
      },
      {
        title: 'Spark! Innovation Fellow',
        duration: 'September 2022 - December 2022',
        description: [
          'Designed NLP model leveraging BERT for social media content moderation and analytics',
        ],
      },
    ],
  },
  {
    company: 'State Department',
    logo: StateDeptLogo,
    roles: [
      {
        title: 'Information Services Center, U.S. Embassy of Ottawa',
        duration: 'June 2019 - August 2020',
        description: [
          'Automated data reorganization processes with Python and VBA, reducing processing times from months to days',
        ],
      },
    ],
  },
];

function WorkExperience() {
  return (
    <div className="mt-20 p-6 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Work Experience</h1>
      <div className="space-y-8">
        {experiences.map((employer, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              {employer.logo && (
                <img src={employer.logo} alt={`${employer.company} Logo`} className="w-12 h-12 mr-4 object-contain" />
                // TODO this could look a lot better but this will work for now
              )}
              <h2 className="text-3xl font-bold">{employer.company}</h2>
            </div>
            <div className="space-y-6">
              {employer.roles.map((role, idx) => (
                <div key={idx}>
                  <h3 className="text-2xl font-semibold">{role.title}</h3>
                  <p className="text-sm text-gray-400">{role.duration}</p>
                  <ul className="mt-2 list-disc list-inside">
                    {role.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkExperience;
