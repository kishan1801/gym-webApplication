import { Link } from 'react-router-dom';
import { ShieldExclamationIcon, HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center p-4">
      <div className="text-center">
        <ShieldExclamationIcon className="h-32 w-32 text-red-500 mx-auto mb-6 animate-pulse" />
        <h1 className="text-5xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-md">
          You don't have permission to access this page. Please check your account role.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-200"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Go to Homepage
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-4 border border-gray-600 text-base font-medium rounded-xl text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Go Back
          </button>
          
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-6 py-4 border border-purple-600 text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-200"
          >
            Switch Account
          </Link>
        </div>
        
        {/* Debug Info */}
        <div className="mt-12 p-4 bg-black/30 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Debug Information</h3>
          <p className="text-sm text-gray-400">
            If you believe this is an error, please check:
          </p>
          <ul className="text-sm text-gray-400 mt-2 text-left list-disc list-inside">
            <li>Your account role in the database</li>
            <li>If you're logged in with the correct account</li>
            <li>Your token permissions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;