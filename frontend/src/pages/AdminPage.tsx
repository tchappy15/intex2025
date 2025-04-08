import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1); // Placeholder value

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md">
        <div className="p-4 font-bold text-xl text-blue-600">Admin Dashboard</div>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Overview</li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Users</li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Settings</li>
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Reports</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Welcome, Admin</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700"
            >
              Back
            </button>
            <button
              style={{
                position: 'fixed',
                top: '10px',
                left: '20px',
                background: '#f8f9fa',
                padding: '10px 15px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                fontSize: '16px',
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
            <p className="text-gray-700">
              This is your admin area. Use the sidebar to navigate through different sections.
            </p>
          </div>

          <Pagination
            pageNum={pageNum}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setPageNum}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPageNum(1);
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
