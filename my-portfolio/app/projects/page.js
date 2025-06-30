import ProjectCard from '../../components/ProjectCard'

const projects = [
  {
    title: 'Whisper AI Glasses',
    description: 'Real-time speech-to-text transcription glasses for accessibility at ImagineRIT.',
    image: '/projects/workshop.jpg',
  },
  {
    title: 'Proxmox & TrueNAS',
    description: 'Managing virtualization and NAS systems for RIT student data backups.',
    image: '/projects/weave-scope.jpg',
  },
  {
    title: 'Introductory Programming',
    description: 'Teaching Python and coding fundamentals through interactive workshops.',
    image: '/projects/coding-teaching.jpg',
  },
]

export default function ProjectsPage() {
  return (
    <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <ProjectCard key={index} {...project} />
      ))}
    </div>
  )
}
