// tools moved under projects, this just bounces old links over
import { redirect } from 'next/navigation'

export default function ToolsPage() {
  redirect('/projects#tools')
}
