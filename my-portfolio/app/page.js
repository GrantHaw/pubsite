import Image from 'next/image'

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto p-8 text-center">
      <Image
        src="/portraits/professional.jpeg"
        width={250}
        height={350}
        className="rounded-xl mx-auto shadow-xl"
        alt="Grant Hawerlander"
      />
      <h1 className="text-4xl font-bold mt-6">Grant Hawerlander</h1>
      <p className="text-gray-600 mt-2">System Administrator | Cybersecurity Professional | Developer</p>
      <p className="mt-4 leading-relaxed text-lg">
        Passionate about cybersecurity, system administration, and education. Currently serving as a System Administrator at RIT Tech Management/ResNet, RTP + Socials Director at Computer Science House, and active in cybersecurity competitions and education. Currently working on mastering Cloud Security and development with Azure.
      </p>
    </div>
  )
}
