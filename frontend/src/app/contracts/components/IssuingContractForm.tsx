import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import axios from "axios";
import {
  RiAddLine,
  RiArrowLeftLine,
  RiExchangeFundsLine,
  RiInformationLine,
} from "react-icons/ri";

interface IssuingContractFormProps {
  onBack: () => void;
  onClose: () => void;
  onSave?: (contractData: any) => Promise<void>;
  clientId?: string;
  clientNumber?: string;
}

interface IssuingContractData {
  liabCategory: string;
  liabContractSearchMethod: string;
  liabContractIdentifier: string;
  clientSearchMethod: string;
  clientIdentifier: string;
  productCode: string;
  productCode2: string;
  productCode3: string;
  branch: string;
  institutionCode: string;
  contractName: string;
  cbsNumber: string;
  addInfo01: string;
  addInfo02: string;
  sessionContext?: string;
  correlationId?: string;
}

interface Contract {
  id: number;
  title: string;
  type: string;
  contractNumber: string;
}

export default function IssuingContractForm({
  onBack,
  onClose,
  onSave,
  clientId,
  clientNumber,
}: IssuingContractFormProps) {
  console.log("IssuingContractForm received clientId:", clientId);
  console.log("IssuingContractForm has onSave:", !!onSave);

  const [issuingContractData, setIssuingContractData] =
    useState<IssuingContractData>({
      liabCategory: "Y",
      liabContractSearchMethod: "CONTRACT_NUMBER",
      liabContractIdentifier: "",
      clientSearchMethod: "CLIENT_NUMBER",
      clientIdentifier: clientNumber || "",
      productCode: "ISSUING_TRAINING01",
      productCode2: "",
      productCode3: "",
      branch: "0101",
      institutionCode: "0001",
      contractName: "Issuing Contract",
      cbsNumber: "",
      addInfo01: "",
      addInfo02: "",
    });

  const [liabilityContracts, setLiabilityContracts] = useState<Contract[]>([]);
  const [isLoadingContracts, setIsLoadingContracts] = useState(false);
  const [contractError, setContractError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  // Fetch Liability Contracts
  useEffect(() => {
    const fetchLiabilityContracts = async () => {
      if (!clientId) {
        setContractError("Client ID is required to fetch contracts");
        return;
      }

      setIsLoadingContracts(true);
      setContractError(null);

      try {
        const response = await axios.get(
          `http://localhost:5000/api/oracle/contracts/client/${clientId}`
        );

        console.log("Liability Contracts API response:", response.data);

        if (response.data.success) {
          const contracts = response.data.data.contracts.filter(
            (contract: Contract) => contract.type === "liability"
          );
          setLiabilityContracts(contracts);
          if (contracts.length === 0) {
            setContractError("No liability contracts found for this client");
          }
        } else {
          setContractError(
            response.data.message || "Failed to fetch contracts"
          );
        }
      } catch (error: any) {
        console.error("Error fetching contracts:", error);
        setContractError(
          error.response?.data?.message || "Cannot connect to server"
        );
      } finally {
        setIsLoadingContracts(false);
      }
    };

    fetchLiabilityContracts();
  }, [clientId]);

  const handleIssuingContractDataChange = (
    field: keyof IssuingContractData,
    value: string
  ) => {
    setIssuingContractData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponse(null);

    try {
      console.log(
        "Sending issuing contract data to backend:",
        issuingContractData
      );

      const response = await axios.post(
        "http://localhost:5000/api/soap/createIssuingContract",
        issuingContractData
      );

      console.log("Response from backend:", response.data);

      if (response.data.success) {
        setResponse("Issuing Contract created successfully!");

        console.log("onSave exists:", !!onSave);
        if (onSave) {
          console.log(
            "Calling onSave with data:",
            response.data.data || issuingContractData
          );
          await onSave(response.data.data || issuingContractData);
        }

        console.log("Closing modal...");
        onClose();
      } else {
        const errorMessage = `Error (${response.data.retCode}): ${response.data.message}`;
        setResponse(errorMessage);
      }
    } catch (error: any) {
      console.error("Error:", error);

      const errorMessage =
        error.response?.data?.message || "Cannot connect to server";
      setResponse(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/20 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100/20 rounded-full -ml-32 -mb-32 blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary-300/20 rounded-full blur-2xl animate-float-slow"></div>

      {/* Contract Type Header */}
      <div
        className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 dark:from-purple-900/30 dark:via-purple-800/20 dark:to-purple-900/30 
        rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-700/30 overflow-hidden transition-all duration-300 hover:shadow-xl"
      >
        <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 dark:from-purple-900 dark:via-purple-800 dark:to-purple-700 px-6 py-4 flex items-center">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
            <RiExchangeFundsLine className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Issuing Contract</h3>
          <button
            type="button"
            className="ml-auto text-white/80 hover:text-white transition-colors duration-200"
            onClick={onBack}
          >
            Change
          </button>
        </div>
      </div>

      <div className="relative z-10">
        <div className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 dark:from-purple-900/30 dark:via-purple-800/20 dark:to-purple-900/30 rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-700/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-400 dark:from-purple-900 dark:via-purple-800 dark:to-purple-600 px-6 py-4 flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
              <RiExchangeFundsLine className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Issuing Contract Information
            </h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Liability Contract Information */}
              <div className="md:col-span-2 bg-white/50 dark:bg-gray-800/30 p-4 rounded-xl shadow-inner">
                <h4 className="text-md font-semibold text-purple-700 dark:text-purple-400 mb-4">
                  Liability Contract Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Select
                      label="Liability Contract Search Method*"
                      value={issuingContractData.liabContractSearchMethod}
                      onChange={(e) =>
                        handleIssuingContractDataChange(
                          "liabContractSearchMethod",
                          e.target.value
                        )
                      }
                      className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                      required
                    >
                      <option value="CONTRACT_NUMBER">CONTRACT_NUMBER</option>
                      <option value="CONTRACT_ID">CONTRACT_ID</option>
                    </Select>
                  </div>
                  <div>
                    <Select
                      label="Liability Contract Identifier*"
                      value={issuingContractData.liabContractIdentifier}
                      onChange={(e) =>
                        handleIssuingContractDataChange(
                          "liabContractIdentifier",
                          e.target.value
                        )
                      }
                      className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                      required
                      disabled={
                        isLoadingContracts || liabilityContracts.length === 0
                      }
                    >
                      {liabilityContracts.map((contract) => (
                        <option
                          key={contract.id}
                          value={contract.contractNumber}
                        >
                          {contract.contractNumber}
                        </option>
                      ))}
                    </Select>
                    {isLoadingContracts && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Loading contracts...
                      </p>
                    )}
                    {contractError && !isLoadingContracts && (
                      <p className="text-sm text-red-500 dark:text-red-400 mt-2">
                        {contractError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="md:col-span-2 bg-white/50 dark:bg-gray-800/30 p-4 rounded-xl shadow-inner">
                <h4 className="text-md font-semibold text-purple-700 dark:text-purple-400 mb-4">
                  Client Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Select
                      label="Client Search Method*"
                      value={issuingContractData.clientSearchMethod}
                      onChange={(e) =>
                        handleIssuingContractDataChange(
                          "clientSearchMethod",
                          e.target.value
                        )
                      }
                      className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                      required
                    >
                      <option value="CLIENT_NUMBER">CLIENT_NUMBER</option>
                      <option value="CLIENT_ID">CLIENT_ID</option>
                    </Select>
                  </div>
                  <div>
                    <Input
                      label="Client Identifier*"
                      value={issuingContractData.clientIdentifier}
                      onChange={(e) =>
                        handleIssuingContractDataChange(
                          "clientIdentifier",
                          e.target.value
                        )
                      }
                      className="py-2.5 pl-4 w-full bg-yellow-100/80 backdrop-blur-sm dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700/50 dark:placeholder-gray-400 transition-all duration-300"
                      required
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div className="md:col-span-2 bg-white/50 dark:bg-gray-800/30 p-4 rounded-xl shadow-inner">
                <h4 className="text-md font-semibold text-purple-700 dark:text-purple-400 mb-4">
                  Product Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Input
                      label="Product Code*"
                      value={issuingContractData.productCode}
                      onChange={(e) =>
                        handleIssuingContractDataChange(
                          "productCode",
                          e.target.value
                        )
                      }
                      className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      label="Product Code 2"
                      value={issuingContractData.productCode2}
                      onChange={(e) =>
                        handleIssuingContractDataChange(
                          "productCode2",
                          e.target.value
                        )
                      }
                      className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <Input
                      label="Product Code 3"
                      value={issuingContractData.productCode3}
                      onChange={(e) =>
                        handleIssuingContractDataChange(
                          "productCode3",
                          e.target.value
                        )
                      }
                      className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Contract Information */}
              <div className="md:col-span-2 bg-white/50 dark:bg-gray-800/30 p-4 rounded-xl shadow-inner">
                <h4 className="text-md font-semibold text-purple-700 dark:text-purple-400 mb-4">
                  Contract Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Branch*"
                      value={issuingContractData.branch}
                      onChange={(e) =>
                        handleIssuingContractDataChange(
                          "branch",
                          e.target.value
                        )
                      }
                      className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      label="Institution Code*"
                      value={issuingContractData.institutionCode}
                      onChange={(e) =>
                        handleIssuingContractDataChange(
                          "institutionCode",
                          e.target.value
                        )
                      }
                      className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      label="Contract Name*"
                      value={issuingContractData.contractName}
                      onChange={(e) =>
                        handleIssuingContractDataChange(
                          "contractName",
                          e.target.value
                        )
                      }
                      className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      label="CBS Number*"
                      value={issuingContractData.cbsNumber}
                      onChange={(e) =>
                        handleIssuingContractDataChange(
                          "cbsNumber",
                          e.target.value
                        )
                      }
                      className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="md:col-span-2 bg-white/50 dark:bg-gray-800/30 p-4 rounded-xl shadow-inner">
                <h4 className="text-md font-semibold text-purple-700 dark:text-purple-400 mb-4">
                  Additional Information
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Input
                      label="Additional Info 1"
                      value={issuingContractData.addInfo01}
                      onChange={(e) =>
                        handleIssuingContractDataChange(
                          "addInfo01",
                          e.target.value
                        )
                      }
                      className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <Input
                      label="Additional Info 2"
                      value={issuingContractData.addInfo02}
                      onChange={(e) =>
                        handleIssuingContractDataChange(
                          "addInfo02",
                          e.target.value
                        )
                      }
                      className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-purple-200 dark:border-purple-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-purple-400 dark:focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Response Display */}
      {response && (
        <div className="bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 dark:from-gray-800 dark:via-purple-900/20 dark:to-purple-900/30 rounded-2xl shadow-xl border-2 border-purple-200/60 dark:border-purple-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-400 dark:from-purple-900 dark:via-purple-800 dark:to-purple-600 px-6 py-4 flex items-center">
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
          disabled={
            isSubmitting ||
            isLoadingContracts ||
            liabilityContracts.length === 0
          }
          className="px-5 py-3 text-base shadow-lg hover:shadow-xl bg-purple-600 text-white hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600 transition-all duration-300 transform hover:-translate-y-1 border-2 border-purple-300/20"
        >
          {isSubmitting ? "Processing..." : "Add Issuing Contract"}
        </Button>
      </div>
    </form>
  );
}
