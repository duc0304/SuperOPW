import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  RiAddLine,
  RiInformationLine,
  RiFileTextLine,
  RiUserSearchLine,
  RiExchangeFundsLine,
  RiMoneyDollarCircleLine,
  RiArrowRightLine,
} from "react-icons/ri";
import { useAppDispatch } from "@/redux/hooks";
import { addContract } from "@/redux/slices/contractSlice";
import { ContractNode } from "../types";
import CardForm from "./CardForm";
import IssuingContractForm from "./IssuingContractForm";
import CardCreationOptions from "./CardCreationOptions";

interface AddContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (contractData: any) => Promise<void>;
  clientId?: string;
}

interface SoapContractData {
  clientSearchMethod: string;
  clientIdentifier: string;
  reason: string;
  branch: string;
  institutionCode: string;
  productCode: string;
  productCode2: string;
  productCode3: string;
  contractName: string;
  cbsNumber: string;
  sessionContext?: string;
  correlationId?: string;
}

// Define contract types
type ContractType = "liability" | "issuing" | "card";

export default function AddContractModal({
  isOpen,
  onClose,
  onSave,
}: AddContractModalProps) {
  const dispatch = useAppDispatch();

  // State to store the selected contract type
  const [selectedContractType, setSelectedContractType] =
    useState<ContractType | null>(null);

  // State to track the card creation step (options or form)
  const [cardCreationStep, setCardCreationStep] = useState<
    "options" | "form" | null
  >(null);

  const [soapContractData, setSoapContractData] = useState<SoapContractData>({
    clientSearchMethod: "CLIENT_NUMBER",
    clientIdentifier: "",
    reason: "",
    branch: "",
    institutionCode: "",
    productCode: "",
    productCode2: "",
    productCode3: "",
    contractName: "Liability Contract",
    cbsNumber: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSoapDataChange = (
    field: keyof SoapContractData,
    value: string
  ) => {
    setSoapContractData((prev) => ({ ...prev, [field]: value }));
  };

  const createNewContract = (): ContractNode => {
    const now = new Date();
    const endDate = new Date();
    endDate.setFullYear(now.getFullYear() + 2);

    return {
      id: `L${Math.floor(Math.random() * 10000)}`,
      title: soapContractData.contractName,
      type: "liability",
      contractNumber:
        soapContractData.cbsNumber || `L-${Math.floor(Math.random() * 100000)}`,
      oracleData: {
        CONTRACT_NUMBER:
          soapContractData.cbsNumber ||
          `L-${Math.floor(Math.random() * 100000)}`,
        CONTRACT_NAME: soapContractData.contractName,
        BRANCH: soapContractData.branch,
        CLIENT__ID: parseInt(soapContractData.clientIdentifier) || 0,
        AMND_DATE: now.toISOString(),
      },
      children: [],
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Validate fields
      if (
        selectedContractType === "liability" &&
        !soapContractData.clientIdentifier
      ) {
        setError("Client identifier is required");
        return;
      }

      if (selectedContractType === "liability") {
        // Call API to create contract via SOAP
        try {
          const response = await axios.post(
            "http://localhost:5000/api/soap/addContract",
            soapContractData
          );

          if (response.data.success) {
            const contractData = response.data.data;

            // If onSave is provided via props, use it
            if (onSave) {
              await onSave(contractData);
            } else {
              // Dispatch action to add contract
              dispatch(addContract(createNewContract()));
            }

            // Close modal and show success message
            onClose();
            toast.success("Contract created successfully!");
          } else {
            setError(response.data.message || "Failed to create contract");
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            setError(error.response?.data?.message || error.message);
          } else {
            setError("An unexpected error occurred");
          }
          console.error("Error creating contract:", error);
        }
      } else {
        // Handle issuing and card contracts
        // If onSave is provided via props, use it
        if (onSave) {
          await onSave(createNewContract());
        } else {
          // Dispatch action to add contract
          dispatch(addContract(createNewContract()));
        }

        // Close modal and show success message
        onClose();
        toast.success("Contract created successfully!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedContractType(null);
      setCardCreationStep(null);
      setSoapContractData({
        clientSearchMethod: "CLIENT_NUMBER",
        clientIdentifier: "",
        reason: "to test",
        branch: "9999",
        institutionCode: "9999",
        productCode: "TEST",
        productCode2: "",
        productCode3: "",
        contractName: "Liability Contract",
        cbsNumber: "",
      });
      setResponse(null);
    }
  }, [isOpen]);

  // Render the contract type selection screen
  const renderContractTypeSelection = () => {
    return (
      <div className="py-8">
        <div className="flex justify-center mb-8">
          <div
            className="bg-gray-100 dark:bg-gray-800/30 
            rounded-2xl shadow-xl border-2 border-gray-200/60 dark:border-gray-700/30 overflow-hidden transition-all duration-300 hover:shadow-xl inline-block"
          >
            <div className="bg-gray-200 dark:bg-gray-700 px-6 py-4">
              <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                Select Contract Type
              </h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Liability Contract Option */}
          <div
            className="bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:via-indigo-800/20 dark:to-indigo-900/30 
              rounded-2xl shadow-lg border-2 border-indigo-200/60 dark:border-indigo-700/30 overflow-hidden 
              transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
            onClick={() => setSelectedContractType("liability")}
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full mb-4">
                <RiFileTextLine className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Liability Contract
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Highest-level responsibility contract
              </p>
              <div className="mt-auto">
                <Button
                  variant="primary"
                  className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
                  icon={RiArrowRightLine}
                  onClick={() => setSelectedContractType("liability")}
                >
                  Select
                </Button>
              </div>
            </div>
          </div>

          {/* Issuing Contract Option */}
          <div
            className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 dark:from-purple-900/30 dark:via-purple-800/20 dark:to-purple-900/30 
              rounded-2xl shadow-lg border-2 border-purple-200/60 dark:border-purple-700/30 overflow-hidden 
              transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
            onClick={() => setSelectedContractType("issuing")}
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className="bg-purple-100 dark:bg-purple-900/50 p-4 rounded-full mb-4">
                <RiExchangeFundsLine className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Issuing Contract
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Issuing contract under Liability Contract
              </p>
              <div className="mt-auto">
                <Button
                  variant="primary"
                  className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
                  icon={RiArrowRightLine}
                  onClick={() => setSelectedContractType("issuing")}
                >
                  Select
                </Button>
              </div>
            </div>
          </div>

          {/* Card Option */}
          <div
            className="bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:via-emerald-800/20 dark:to-emerald-900/30 
              rounded-2xl shadow-lg border-2 border-emerald-200/60 dark:border-emerald-700/30 overflow-hidden 
              transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
            onClick={() => {
              setSelectedContractType("card");
              setCardCreationStep("options");
            }}
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/50 p-4 rounded-full mb-4">
                <RiMoneyDollarCircleLine className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Card
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Card under Issuing Contract
              </p>
              <div className="mt-auto">
                <Button
                  variant="primary"
                  className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
                  icon={RiArrowRightLine}
                  onClick={() => {
                    setSelectedContractType("card");
                    setCardCreationStep("options");
                  }}
                >
                  Select
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the form to create a Liability Contract
  const renderLiabilityContractForm = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary-300/20 rounded-full blur-2xl animate-float-slow"></div>

        {/* Contract Type Header */}
        <div
          className="bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:via-indigo-800/20 dark:to-indigo-900/30 
          rounded-2xl shadow-xl border-2 border-indigo-200/60 dark:border-indigo-700/30 overflow-hidden transition-all duration-300 hover:shadow-xl"
        >
          <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-500 dark:from-indigo-900 dark:via-indigo-800 dark:to-indigo-700 px-6 py-4 flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
              <RiFileTextLine className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Liability Contract
            </h3>
            <button
              type="button"
              className="ml-auto text-white/80 hover:text-white transition-colors duration-200"
              onClick={() => setSelectedContractType(null)}
            >
              Change
            </button>
          </div>
        </div>

        {/* Client Search Information */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/30 rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 px-6 py-4 flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
              <RiUserSearchLine className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Client Search Information
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Select
                  label="Client Search Method*"
                  value={soapContractData.clientSearchMethod}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleSoapDataChange("clientSearchMethod", e.target.value)
                  }
                  className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                  required
                >
                  <option value="CLIENT_NUMBER">CLIENT_NUMBER</option>
                  <option value="CLIENT_ID">CLIENT_ID</option>
                  <option value="IDENTITY_CARD">IDENTITY_CARD</option>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Client Identifier*"
                  value={soapContractData.clientIdentifier}
                  onChange={(e) =>
                    handleSoapDataChange("clientIdentifier", e.target.value)
                  }
                  className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <Input
                label="Reason"
                value={soapContractData.reason}
                onChange={(e) => handleSoapDataChange("reason", e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Contract Information */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/30 rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 px-6 py-4 flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
              <RiFileTextLine className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Contract Information
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Input
                label="Branch*"
                value={soapContractData.branch}
                onChange={(e) => handleSoapDataChange("branch", e.target.value)}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
              <Input
                label="Institution Code*"
                value={soapContractData.institutionCode}
                onChange={(e) =>
                  handleSoapDataChange("institutionCode", e.target.value)
                }
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
              <Input
                label="Contract Name*"
                value={soapContractData.contractName}
                onChange={(e) =>
                  handleSoapDataChange("contractName", e.target.value)
                }
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Input
                label="Product Code*"
                value={soapContractData.productCode}
                onChange={(e) =>
                  handleSoapDataChange("productCode", e.target.value)
                }
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                required
              />
              <Input
                label="Product Code 2"
                value={soapContractData.productCode2}
                onChange={(e) =>
                  handleSoapDataChange("productCode2", e.target.value)
                }
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
              />
              <Input
                label="Product Code 3"
                value={soapContractData.productCode3}
                onChange={(e) =>
                  handleSoapDataChange("productCode3", e.target.value)
                }
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <Input
                label="CBS Number"
                value={soapContractData.cbsNumber}
                onChange={(e) =>
                  handleSoapDataChange("cbsNumber", e.target.value)
                }
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Response Display */}
        {response && (
          <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-indigo-900/30 rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
            <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-primary-400 dark:from-primary-900 dark:via-primary-800 dark:to-primary-600 px-6 py-4 flex items-center">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
                <RiInformationLine className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Result</h3>
            </div>
            <div className="p-6">
              <div
                className={`p-4 rounded-xl text-center text-lg font-medium shadow-inner ${
                  response.includes("Error")
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                }`}
              >
                {response}
              </div>
            </div>
          </div>
        )}

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
            icon={RiAddLine}
            disabled={isSubmitting}
            className="px-5 py-3 text-base shadow-lg hover:shadow-xl bg-primary-800 text-white hover:bg-primary-700 dark:bg-primary-900 dark:hover:bg-primary-800 transition-all duration-300 transform hover:-translate-y-1 border-2 border-primary-300/20"
          >
            {isSubmitting ? "Processing..." : "Add contract"}
          </Button>
        </div>
      </form>
    );
  };

  // Render the form to create an Issuing Contract
  const renderIssuingContractForm = () => {
    return (
      <IssuingContractForm
        onBack={() => setSelectedContractType(null)}
        onClose={onClose}
      />
    );
  };

  // Render the interface to select the card creation method
  const renderCardCreationOptions = () => {
    return (
      <CardCreationOptions
        onSelectLiability={() => setCardCreationStep("form")}
        onSelectIssuing={() => setCardCreationStep("form")}
        onBack={() => setSelectedContractType(null)}
      />
    );
  };

  // Render the form to create a Card
  const renderCardForm = () => {
    return (
      <CardForm
        onBack={() => setCardCreationStep("options")}
        onClose={onClose}
      />
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-5xl"
      title={
        selectedContractType === null
          ? "Add New Contract"
          : selectedContractType === "liability"
          ? "Create Liability Contract"
          : selectedContractType === "issuing"
          ? "Create Issuing Contract"
          : cardCreationStep === "options"
          ? "Select Card Creation Method"
          : "Create Card"
      }
    >
      {selectedContractType === null && renderContractTypeSelection()}
      {selectedContractType === "liability" && renderLiabilityContractForm()}
      {selectedContractType === "issuing" && renderIssuingContractForm()}
      {selectedContractType === "card" &&
        cardCreationStep === "options" &&
        renderCardCreationOptions()}
      {selectedContractType === "card" &&
        cardCreationStep === "form" &&
        renderCardForm()}
    </Modal>
  );
}
