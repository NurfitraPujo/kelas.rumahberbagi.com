import { Outlet } from 'react-router-dom'

export default function Verify() {
  return (
    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
      <Outlet />
    </div>
  )
}
