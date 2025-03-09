import { useState, useEffect } from 'react';

export default function Home() {
  const [tests, setTests] = useState([]);
  const [formData, setFormData] = useState({
    patientName: '',
    testType: '',
    result: '',
    testDate: '',
    notes: '',
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    const response = await fetch('/api/tests');
    const data = await response.json();
    setTests(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editId ? `/api/tests/${editId}` : '/api/tests';
    const method = editId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      fetchTests();
      setFormData({ patientName: '', testType: '', result: '', testDate: '', notes: '' });
      setEditId(null);
    }
  };

  const handleEdit = (test) => {
    setFormData({
      patientName: test.patientName,
      testType: test.testType,
      result: test.result,
      testDate: test.testDate.split('T')[0], // Format date for input
      notes: test.notes || '',
    });
    setEditId(test.id);
  };

  const handleDelete = async (id) => {
    const response = await fetch(`/api/tests/${id}`, { method: 'DELETE' });
    if (response.ok) {
      fetchTests();
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-10">
          Diagnostic Test Results Management
        </h1>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md mb-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            {editId ? 'Edit Test Result' : 'Add New Test Result'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Patient Name"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Test Type"
              value={formData.testType}
              onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Result"
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="date"
              value={formData.testDate}
              onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <textarea
            placeholder="Notes (Optional)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full p-3 mt-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {editId ? 'Update' : 'Add'} Test Result
          </button>
        </form>

        {/* Test Results Table */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Test Results
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-4 text-left">Patient Name</th>
                  <th className="p-4 text-left">Test Type</th>
                  <th className="p-4 text-left">Result</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Notes</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => (
                  <tr key={test.id} className="border-b hover:bg-gray-50 transition duration-200">
                    <td className="p-4">{test.patientName}</td>
                    <td className="p-4">{test.testType}</td>
                    <td className="p-4">{test.result}</td>
                    <td className="p-4">{new Date(test.testDate).toLocaleDateString()}</td>
                    <td className="p-4">{test.notes}</td>
                    <td className="p-4 space-x-3">
                      <button
                        onClick={() => handleEdit(test)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(test.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}