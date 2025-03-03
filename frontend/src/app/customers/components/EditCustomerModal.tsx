import { Customer } from '../mock_customers';
import Modal from '@/components/Modal';

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  formData: Omit<Customer, 'id'>;
  setFormData: (data: Omit<Customer, 'id'>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EditCustomerModal({ 
  isOpen, 
  onClose, 
  customer,
  formData, 
  setFormData, 
  onSubmit 
}: EditCustomerModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Customer"
      maxWidth="max-w-5xl" // Wider modal
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors duration-200">
          <div className="card-header">
            <h3 className="text-lg font-medium text-purple-600 dark:text-purple-300 transition-colors duration-200">Company Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Company Name*</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Short Name*</label>
                <input
                  type="text"
                  value={formData.shortName}
                  onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Client Number*</label>
                <input
                  type="text"
                  value={formData.clientNumber}
                  onChange={(e) => setFormData({ ...formData, clientNumber: e.target.value })}
                  className="input"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors duration-200">
          <div className="card-header">
            <h3 className="text-lg font-medium text-purple-600 dark:text-purple-300 transition-colors duration-200">Client Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Client Type Code*</label>
                <input
                  type="text"
                  value={formData.clientTypeCode}
                  onChange={(e) => setFormData({ ...formData, clientTypeCode: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Reason Code*</label>
                <input
                  type="text"
                  value={formData.reasonCode}
                  onChange={(e) => setFormData({ ...formData, reasonCode: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Reason*</label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Institution Code*</label>
                <input
                  type="text"
                  value={formData.institutionCode}
                  onChange={(e) => setFormData({ ...formData, institutionCode: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Branch*</label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="input"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors duration-200">
          <div className="card-header">
            <h3 className="text-lg font-medium text-purple-600 dark:text-purple-300 transition-colors duration-200">Category Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Client Category*</label>
                <input
                  type="text"
                  value={formData.clientCategory}
                  onChange={(e) => setFormData({ ...formData, clientCategory: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Product Category*</label>
                <input
                  type="text"
                  value={formData.productCategory}
                  onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="input"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}