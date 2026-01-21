import { Outlet } from 'react-router-dom';
  
const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
       <div className="flex">
         <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;