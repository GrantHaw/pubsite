// projects list, shared by the projects page and the shell
const projects = [
  {
    id: 'mallard', title: 'Mallard', img: '/y2k/mallard.png', contain: true, alt: 'Mallard Deception Platform logo',
    desc: 'An open-source deception platform built at Coalfire Division Hex to stop autonomous LLM pentest agents. One Linux host poses as a fleet of decoy machines inside a corporate Active Directory network, each on its own NIC. Traps include a fake domain controller tarpit, a zip-bomb file server, and prompt injections that bait over-privileged agents into giving themselves away.',
    tags: ['llm agents', 'active directory', 'docker'],
    wide: true,
  },
  {
    id: 'homelab', title: 'Homelab', img: '/projects/weave-scope.jpeg', alt: 'Proxmox logo',
    desc: 'A two-node Proxmox cluster behind OPNsense, with WireGuard for remote access, Caddy as the reverse proxy, and Authentik single sign-on across everything. Also managed Proxmox and TrueNAS for RIT student data backups.',
    tags: ['proxmox', 'opnsense', 'authentik'],
    link: 'https://granthaw.github.io/ProxmoxSetup/',
  },
  {
    id: 'ctf', title: 'CTFs', img: '/y2k/ritsec.jpg', alt: 'RITSEC CTF logo',
    desc: 'Top RIT team at RITSEC CTF 2025 with the highest score of any RIT competitor, and the highest RIT score again at WiCyS National CTF 2026. Mostly reverse engineering, forensics, web, and stego.',
    tags: ['rev', 'forensics', 'web'],
  },
  {
    id: 'whisper', title: 'Whisper AI Glasses', img: '/projects/workshop.jpeg', alt: 'Demoing the Whisper AI glasses at ImagineRIT',
    desc: 'Real-time speech-to-text transcription glasses for accessibility, shown at ImagineRIT.',
    link: 'https://github.com/GrantHaw/Live-Transcription',
  },
  {
    id: 'teaching', title: 'Intro Programming and Ethical Hacking', img: '/projects/coding-teaching.jpeg', alt: 'Teaching a coding workshop',
    desc: 'Taught Python and coding fundamentals through workshops and lectures, and helped beginner English students build text-based software of their choosing.',
    link: 'https://github.com/GrantHaw/VAISPhishingCampaign',
  },
  {
    id: 'azure', title: 'Azure Development and Security', img: '/projects/azure.png', alt: 'Phishing awareness demo page',
    desc: 'Deployed secure web apps on Azure and tuned network security groups for real-world threat models. Published a phishing awareness site that tracked clicks and IP addresses.',
    link: 'https://github.com/GrantHaw/VAISPhishingCampaign',
  },
]
export default projects
