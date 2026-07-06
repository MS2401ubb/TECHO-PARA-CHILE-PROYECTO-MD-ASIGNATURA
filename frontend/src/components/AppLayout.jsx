import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

function AppLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="layout-shell">
      <Header onOpenMenu={() => setOpen(true)} />
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <main className="layout-main" onClick={() => open && setOpen(false)}>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
