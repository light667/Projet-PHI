import { Outlet } from 'react-router-dom'
import { DynamicBackground } from '../DynamicBackground'
import { Header } from './Header'

export function MainLayout() {
  return (
    <div className="relative flex min-h-screen flex-col text-white">
      <DynamicBackground />
      <Header />
      <div className="relative flex flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  )
}
