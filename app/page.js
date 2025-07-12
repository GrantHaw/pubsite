import Image from "next/image";

export default function Home() {
  return (
    <section className="mt-16 text-center mb-12">
      <div className="inline-block rounded-full overflow-hidden w-48 h-48 mb-4">
        <Image
          src="/portraits/professional.jpeg"
          alt="Grant Hawerlander"
          width={192}
          height={192}
          className="object-cover"
          unoptimized={true}
        />
      </div>
      <h1 className="text-4xl font-bold">Grant Hawerlander</h1>
      <p className="text-xl text-gray-700 dark:text-gray-300">
        System Administrator | Cybersecurity Professional | Developer
      </p>
      <p className="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
        Passionate about cybersecurity, system administration, and education.
        Currently serving as a System Administrator at RIT Tech Management/ResNet,
        RTP + Socials Director at Computer Science House, and active in cybersecurity
        competitions and education. Currently working on mastering Cloud Security
        and development with Azure.
      </p>
    </section>
  );
}
