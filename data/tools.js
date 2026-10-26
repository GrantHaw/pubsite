// tools list. add new ones here, thats it
const tools = [
  {
    cat: 'tc', id: 'part-sourcing', name: 'Part Sourcing Extension',
    what: 'Scrapes eBay and Amazon listings and fills in the Tech Center part sourcing template on repair tickets.',
    tech: 'Chrome + Firefox extension',
    link: 'https://github.com/GrantHaw/tc-part-sourcing',
  },
  {
    cat: 'tc', id: 'absence-bot', name: 'Absence Bot',
    what: 'Slack bot for logging late arrivals and call-outs through a form, with lookups and a Monday summary.',
    tech: 'Python, Slack Bolt, Google Sheets',
    link: 'https://github.com/GrantHaw/absence-bot',
  },
  {
    cat: 'tc', id: 'ticket-tracker', name: 'Ticket Tracker Dashboard',
    what: 'Pulls ticket activity from Slack and graphs Tech Center workload.',
    tech: 'Flask, SQLite, Docker',
    link: 'https://github.com/GrantHaw/Ticket-Tracker-Dashboard',
  },
  {
    cat: 'tc', id: 'ifixit-kiosk', name: 'iFixit Checkout Kiosk',
    what: 'Self-serve checkout for the Tech Center repair kits, using student ID cards.',
    tech: 'Raspberry Pi, Flask, NFC',
    link: 'https://github.com/GrantHaw/iFixIt-Checkout-Kiosk',
  },
  {
    cat: 'ctf', id: 'fcfile', name: 'fcfile',
    what: 'First-contact triage for CTF forensics files. Runs the usual recon, hunts for flags in ASCII, UTF-16, and base64 strings, flags a wrong extension, then runs the right follow-ups for the file type. Comes with fcgen, which prints the commands instead of running them.',
    tech: 'Bash',
    link: 'https://github.com/GrantHaw/fcfile',
  },
  {
    cat: 'ctf', id: 'decode', name: 'decode.py',
    what: 'Throws every common encoding at a string and peels nested layers until a flag falls out. Brute forces Caesar and single-byte XOR, and ranks results so the real flag comes first.',
    tech: 'Python',
    link: 'https://github.com/GrantHaw/decode',
  },
]
// sections on the projects page, in order
export const toolCats = [
  { id: 'tc', name: 'Tech Center', blurb: 'Internal tools I built for the RIT ITS Tech Center.' },
  { id: 'ctf', name: 'CTF and pentesting', blurb: 'Stuff I made for competitions and engagements.' },
]
export default tools
