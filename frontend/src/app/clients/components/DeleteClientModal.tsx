import Modal from '@/components/Modal';
import type { Client } from '@/redux/slices/clientSlice';

interface DeleteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onDelete: () => void;
}

export default function DeleteClientModal({ 
  isOpen, 
  onClose, 
  client, 
  onDelete 
}: DeleteClientModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Client"
    >
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300 transition-colors duration-200">
          Are you sure you want to delete <span className="font-medium">{client?.companyName}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
} 