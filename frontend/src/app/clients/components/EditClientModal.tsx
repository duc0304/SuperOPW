import { useState } from 'react';
import type { Client } from '@/redux/slices/clientSlice';
import Modal from '@/components/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { RiSaveLine, RiBuilding2Line, RiUser3Line, RiFileList2Line, RiInformationLine } from 'react-icons/ri';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  formData: Omit<Client, 'ID'>;
  setFormData: (data: Omit<Client, 'ID'>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EditClientModal({ 
  isOpen, 
  onClose, 
  client,
  formData, 
  setFormData, 
  onSubmit 
}: EditClientModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true);
    await onSubmit(e);
    setIsSubmitting(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Client"
      maxWidth="max-w-5xl"
    >
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary-300/20 rounded-full blur-2xl animate-float-slow"></div>
        
        {/* Company Information */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/30 rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 px-6 py-4 flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
              <RiBuilding2Line className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Company Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Company Name*"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
              <Input
                label="Short Name*"
                value={formData.shortName}
                onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
              <Input
                label="Client Number*"
                value={formData.clientNumber}
                onChange={(e) => setFormData({ ...formData, clientNumber: e.target.value })}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/30 rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 px-6 py-4 flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
              <RiUser3Line className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Client Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Input
                label="Client Type Code*"
                value={formData.clientTypeCode}
                onChange={(e) => setFormData({ ...formData, clientTypeCode: e.target.value })}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
              <Input
                label="Reason Code*"
                value={formData.reasonCode}
                onChange={(e) => setFormData({ ...formData, reasonCode: e.target.value })}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
              <Input
                label="Reason*"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Institution Code*"
                value={formData.institutionCode}
                onChange={(e) => setFormData({ ...formData, institutionCode: e.target.value })}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
              <Input
                label="Branch*"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Category Information */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/30 rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 px-6 py-4 flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
              <RiFileList2Line className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Category Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Client Category*"
                value={formData.clientCategory}
                onChange={(e) => setFormData({ ...formData, clientCategory: e.target.value })}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
              <Input
                label="Product Category*"
                value={formData.productCategory}
                onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border border-purple-200 dark:border-purple-700/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 focus:shadow-md"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <Button
            onClick={onClose}
            variant="secondary"
            className="transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-700/80 border-purple-200 dark:border-purple-700/50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={RiSaveLine}
            disabled={isSubmitting}
            className="px-5 py-3 text-base shadow-lg hover:shadow-xl bg-primary-800 text-white hover:bg-primary-700 dark:bg-primary-900 dark:hover:bg-primary-800 transition-all duration-300 transform hover:-translate-y-1 border-2 border-primary-300/20"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}