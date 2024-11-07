import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface JobApplication {
  _id?: string;
  company: string;
  url: string;
  website: string;
  status: string;
  applied: string;
  deadline: string;
}

const JobApplicationManagement = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentApp, setCurrentApp] = useState<JobApplication | null>(null);

  const [newApp, setNewApp] = useState<JobApplication>({
    company: '',
    url: '',
    website: '',
    status: 'applied',
    applied: '',
    deadline: '',
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State for Delete Confirmation Modal
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteAppId, setDeleteAppId] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/applications')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setApplications(data);
        }
      })
      .catch((error) => console.error('Error fetching applications:', error));
  }, []);

  // Handle adding new application
  const handleAddApplication = () => {
    fetch('http://localhost:3000/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newApp),
    })
      .then((response) => response.json())
      .then((data) => {
        setApplications((prevApps) => [...prevApps, data]);
        setShowModal(false);
        toast.success('Application added successfully!');
      })
      .catch((error) => {
        console.error('Error adding application:', error);
        toast.error('Failed to add application.');
      });
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Handle edit of an application
  const handleEdit = (app: JobApplication) => {
    setIsUpdate(true);
    setCurrentApp(app);
    setNewApp({
      _id: app._id,
      company: app.company,
      url: app.url,
      website: app.website,
      status: app.status,
      applied: formatDate(app.applied),
      deadline: formatDate(app.deadline),
    });

    setShowModal(true);
  };

  // Handle updating existing application
  const handleUpdateApplication = () => {
    if (currentApp?._id) {
      fetch(`http://localhost:3000/api/applications/${currentApp._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newApp),
      })
        .then((response) => response.json())
        .then((data) => {
          setApplications((prevApps) =>
            prevApps.map((app) =>
              app._id === data._id ? data : app
            )
          );
          setShowModal(false);
          toast.success('Application updated successfully!');
        })
        .catch((error) => {
          console.error('Error updating application:', error);
          toast.error('Failed to update application.');
        });
    }
  };

  // Handle delete of an application - show confirmation modal
  const handleDelete = (id: string) => {
    setDeleteAppId(id);
    setShowDeleteConfirmModal(true);
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewApp({
      ...newApp,
      [e.target.name]: e.target.value,
    });
  };

  // Get color for the status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      case "noresponse":
        return "bg-gray-500 text-white";
      case "accepted":
        return "bg-green-500 text-white";
      case "assignment":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-200 text-black";
    }
  };

  // Get paginated applications
  const currentApplications = applications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination Controls
  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(page);

  // Handle deleting application
  const handleConfirmDelete = () => {
    if (deleteAppId) {
      fetch(`http://localhost:3000/api/applications/${deleteAppId}`, {
        method: 'DELETE',
      })
        .then(() => {
          setApplications((prevApps) => prevApps.filter((app) => app._id !== deleteAppId));
          setShowDeleteConfirmModal(false);
          toast.success('Application deleted successfully!');
        })
        .catch((error) => {
          console.error('Error deleting application:', error);
          toast.error('Failed to delete application.');
        });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center">Job Application Management</h1>
      <button
        onClick={() => {
          setIsUpdate(false);
          setNewApp({
            company: '',
            url: '',
            website: '',
            status: 'applied',
            applied: '',
            deadline: '',
          });
          setShowModal(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-2"
      >
        Add Application
      </button>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">#</th>
              <th scope="col" className="px-6 py-3">Company</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Applied</th>
              <th scope="col" className="px-6 py-3">Deadline</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentApplications.map((app, index) => (
              <tr key={app._id} className="odd:bg-white even:bg-gray-50 border-b">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <th scope="row" className="px-6 py-4 font-medium text-blue-700 whitespace-nowrap underline">
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {app.company}
                  </a>
                </th>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4">{new Date(app.applied).toLocaleDateString()}</td>
                <td className="px-6 py-4">{new Date(app.deadline).toLocaleDateString()}</td>
                <td className="space-x-4 px-6 py-4">
                  <button
                    onClick={() => handleEdit(app)}
                    className="text-yellow-500 hover:text-yellow-600 transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(app._id!)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center mt-4 float-right">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          dir="ltr"
          className="text-gray-700 px-4 py-2 transition-colors disabled:opacity-70 border rounded-s-lg"
        >
          Previous
        </button>
        <span className="border px-4 py-2 text-gray-700">{currentPage}</span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          dir="ltr"
          className="text-gray-700 px-4 py-2 transition-colors disabled:opacity-70 border rounded-e-lg"
        >
          Next
        </button>
      </div>

      {/* Notification Toast */}
      <ToastContainer />

      {/* Modal for adding/editing applications */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">{isUpdate ? 'Update' : 'Add'} Application</h2>
            <form>
              <input
                type="text"
                name="company"
                value={newApp.company}
                onChange={handleChange}
                placeholder="Company"
                className="w-full px-4 py-2 mb-4 border rounded"
              />
              <input
                type="url"
                name="url"
                value={newApp.url}
                onChange={handleChange}
                placeholder="URL"
                className="w-full px-4 py-2 mb-4 border rounded"
              />
              <input
                type="url"
                name="website"
                value={newApp.website}
                onChange={handleChange}
                placeholder="Website"
                className="w-full px-4 py-2 mb-4 border rounded"
              />
              <select
                name="status"
                value={newApp.status}
                onChange={handleChange}
                className="w-full px-4 py-2 mb-4 border rounded"
              >
                <option value="applied">Applied</option>
                <option value="rejected">Rejected</option>
                <option value="noresponse">No Response</option>
                <option value="accepted">Accepted</option>
                <option value="assignment">Assignment</option>
              </select>
              <input
                type="date"
                name="applied"
                value={newApp.applied}
                onChange={handleChange}
                className="w-full px-4 py-2 mb-4 border rounded"
              />
              <input
                type="date"
                name="deadline"
                value={newApp.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2 mb-4 border rounded"
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={isUpdate ? handleUpdateApplication : handleAddApplication}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {isUpdate ? 'Update' : 'Add'} Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg w-96">
            <h2 className="text-2xl font-semibold">Confirm Deletion</h2>
            <p>Are you sure you want to delete this application?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplicationManagement;