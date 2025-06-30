import Image from 'next/image'

export default function ProjectCard({ title, description, image }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Image src={image} width={400} height={250} alt={title} />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
    </div>
  )
}
