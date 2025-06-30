'use client'
import Image from 'next/image'

export default function ProjectCard({ project }) {
  return (
    <a href={project.link} target="_blank" rel="noopener noreferrer">
      <div className="mb-4 break-inside-avoid bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative w-full">
          <Image
            src={project.image}
            alt={project.title}
            layout="responsive"
            width={500}
            height={300}
            className="object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
            <h2 className="text-white text-lg font-bold">{project.title}</h2>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-700">{project.description}</p>
        </div>
      </div>
    </a>
  )
}
