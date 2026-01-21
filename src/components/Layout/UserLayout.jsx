import { Outlet } from 'react-router-dom';
  
const UserLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
       <div className="flex">
        
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;