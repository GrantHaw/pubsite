// app/projects/page.js
import ProjectCard from '../../components/ProjectCard';

const projects = [
  {
    title: "Proxmox & TrueNAS",
    description:
      "Managing virtualization and NAS systems for RIT student data backups & creating and managing my own infrastructure.",
    image: "/projects/weave-scope.jpeg",
    link: "https://granthaw.github.io/ProxmoxSetup/",
  },
  {
    title: "Pubsite",
    description:
      "Built and deployed my own portfolio website to showcase personal projects, skills, and experiences.",
    image: "/projects/pubsite.png",
    link: "/",
  },
  {
    title: "Whisper AI Glasses",
    description:
      "Real-time speech-to-text transcription glasses for accessibility at ImagineRIT.",
    image: "/projects/workshop.jpeg",
    link: "https://github.com/GrantHaw/Live-Transcription",
  },
  {
    title: "Introductory Programming & Ethical Hacking",
    description:
      "Teaching Python and coding fundamentals through interactive workshops and lectures. Helped beginner English students create a text-based software of their choosing.",
    image: "/projects/coding-teaching.jpeg",
    link: "https://github.com/GrantHaw/VAISPhishingCampaign",
  },
  {
    title: "Azure Development + Security",
    description:
      "Deploying secure web apps using Azure and optimizing network security groups for real-world threat models. Published a phishing target website that tracked clicks and IP addresses.",
    image: "/projects/azure.png",
    link: "https://github.com/GrantHaw/VAISPhishingCampaign",
  },
];

export default function ProjectsPage() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 p-4">
      {projects.map((project, index) => (
        <ProjectCard key={index} project={project} />
      ))}
    </div>
  );
}
