import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import axios from "axios";
import {
  RiAddLine,
  RiArrowLeftLine,
  RiIdCardLine,
  RiInformationLine,
} from "react-icons/ri";
import { useAppDispatch } from "@/redux/hooks";
import { showToast } from "@/redux/slices/toastSlice";

interface CardFormProps {
  onBack: () => void;
  onClose: () => void;
  onSave?: (cardData: any) => Promise<void>;
  clientId?: string;
  clientNumber?: string;
}

interface CardData {
  contractSearchMethod: string;
  contractIdentifier: string;
  productCode: string;
  productCode2: string;
  productCode3: string;
  cardName: string;
  cbsNumber: string;
  embossedFirstName: string;
  embossedLastName: string;
  embossedCompanyName: string;
  sessionContext?: string;
  correlationId?: string;
}

interface Contract {
  id: number;
  title: string;
  type?: string;
  contractNumber: string;
}

interface IssuingContract {
  id: number;
  title: string;
  contractNumber: string;
}

export default function CardForm({
  onBack,
  onClose,
  onSave,
  clientId,
  clientNumber,
}: CardFormProps) {
  const dispatch = useAppDispatch();
  const [cardData, setCardData] = useState<CardData>({
    contractSearchMethod: "CONTRACT_NUMBER",
    contractIdentifier: "",
    productCode: "CARD_TRAINING01",
    productCode2: "",
    productCode3: "",
    cardName: "Card Contract",
    cbsNumber: "",
    embossedFirstName: "",
    embossedLastName: "",
    embossedCompanyName: "",
  });

  const [selectedLiability, setSelectedLiability] = useState<string>("");
  const [selectedIssuing, setSelectedIssuing] = useState<string>("");
  const [selectedLiabilityId, setSelectedLiabilityId] = useState<number | null>(
    null
  );
  const [isAutoGenerateIssue, setIsAutoGenerateIssue] =
    useState<boolean>(false);

  const [liabilityContracts, setLiabilityContracts] = useState<Contract[]>([]);
  const [issuingContracts, setIssuingContracts] = useState<IssuingContract[]>(
    []
  );
  const [isLoadingLiabilityContracts, setIsLoadingLiabilityContracts] =
    useState(false);
  const [isLoadingIssuingContracts, setIsLoadingIssuingContracts] =
    useState(false);
  const [liabilityContractError, setLiabilityContractError] = useState<
    string | null
  >(null);
  const [issuingContractError, setIssuingContractError] = useState<
    string | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  // Fetch Liability Contracts
  useEffect(() => {
    const fetchLiabilityContracts = async () => {
      if (!clientId) {
        setLiabilityContractError("Client ID is required to fetch contracts");
        return;
      }

      setIsLoadingLiabilityContracts(true);
      setLiabilityContractError(null);

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
            setLiabilityContractError(
              "No liability contracts found for this client"
            );
          }
        } else {
          setLiabilityContractError(
            response.data.message || "Failed to fetch liability contracts"
          );
        }
      } catch (error: any) {
        console.error("Error fetching liability contracts:", error);
        setLiabilityContractError(
          error.response?.data?.message || "Cannot connect to server"
        );
      } finally {
        setIsLoadingLiabilityContracts(false);
      }
    };

    fetchLiabilityContracts();
  }, [clientId]);

  // Fetch Issuing Contracts
  useEffect(() => {
    const fetchIssuingContracts = async () => {
      if (!selectedLiabilityId) {
        setIssuingContracts([]);
        setIssuingContractError(null);
        return;
      }

      setIsLoadingIssuingContracts(true);
      setIssuingContractError(null);

      try {
        const response = await axios.get(
          `http://localhost:5000/api/oracle/contracts/${selectedLiabilityId}/issue-children`
        );

        console.log("Issuing Contracts API response:", response.data);

        if (response.data.success) {
          const contracts: IssuingContract[] = response.data.data.map(
            (item: any) => ({
              id: item.ID,
              title: item.CONTRACT_NAME,
              contractNumber: item.CONTRACT_NUMBER,
            })
          );
          console.log("Mapped issuing contracts:", contracts);
          setIssuingContracts(contracts);
          if (contracts.length === 0) {
          }
        } else {
          setIssuingContractError(
            response.data.message || "Failed to fetch issuing contracts"
          );
        }
      } catch (error: any) {
        console.error("Error fetching issuing contracts:", error);
        setIssuingContractError(
          error.response?.data?.message || "Cannot connect to server"
        );
      } finally {
        setIsLoadingIssuingContracts(false);
      }
    };

    fetchIssuingContracts();
  }, [selectedLiabilityId]);

  // Handle Liability Contract selection
  const handleLiabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedLiability(selectedValue);
    setSelectedIssuing(""); // Reset issuing contract selection
    setIsAutoGenerateIssue(false); // Reset auto-generate checkbox
    setCardData((prev) => ({ ...prev, contractIdentifier: "" })); // Reset contractIdentifier
    const selectedContract = liabilityContracts.find(
      (contract) => contract.contractNumber === selectedValue
    );
    setSelectedLiabilityId(selectedContract ? selectedContract.id : null);
  };

  // Handle Issuing Contract selection
  const handleIssuingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedIssuing(selectedValue);
    handleCardDataChange("contractIdentifier", selectedValue); // Auto-fill contractIdentifier with contractNumber
  };

  const handleCardDataChange = (field: keyof CardData, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponse(null);

    try {
      let finalCardData = { ...cardData };

      // If auto-generate Issuing Contract is selected
      if (isAutoGenerateIssue) {
        // Prepare data for creating Issuing Contract
        const issuingContractData = {
          liabCategory: "Y",
          liabContractSearchMethod: "CONTRACT_NUMBER",
          liabContractIdentifier: selectedLiability,
          clientSearchMethod: "CLIENT_NUMBER",
          clientIdentifier: clientNumber || "",
          productCode: "ISSUING_TRAINING01",
          productCode2: "",
          productCode3: "",
          branch: "0101",
          institutionCode: "0001",
          contractName: "Auto-generated Issuing Contract",
          cbsNumber: cardData.cbsNumber || "",
          addInfo01: "",
          addInfo02: "",
        };

        console.log(
          "Sending issuing contract data to backend:",
          issuingContractData
        );

        // Call API to create Issuing Contract
        const issueResponse = await axios.post(
          "http://localhost:5000/api/soap/createIssuingContract",
          issuingContractData
        );

        console.log("Issuing Contract API response:", issueResponse.data);

        if (!issueResponse.data.success) {
          throw new Error(
            issueResponse.data.message || "Không thể tạo Issuing Contract"
          );
        }

        // Parse rawResponse XML to get ContractNumber
        let contractNumber: string | null = null;
        if (issueResponse.data.rawResponse) {
          try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(
              issueResponse.data.rawResponse,
              "text/xml"
            );
            const contractNumberNode =
              xmlDoc.getElementsByTagName("ContractNumber")[0];
            contractNumber = contractNumberNode?.textContent || null;
          } catch (parseError) {
            console.error("Error parsing XML:", parseError);
            throw new Error(
              "Không thể phân tích rawResponse để lấy ContractNumber"
            );
          }
        }

        if (!contractNumber) {
          throw new Error(
            "Không tìm thấy ContractNumber trong rawResponse của API tạo Issuing Contract"
          );
        }

        finalCardData.contractIdentifier = contractNumber;
      }

      console.log("Sending card data to backend:", finalCardData);

      // Call API to create Card
      const cardResponse = await axios.post(
        "http://localhost:5000/api/soap/createCard",
        finalCardData
      );

      console.log("Card API response:", cardResponse.data);

      if (cardResponse.data.success) {
        setResponse("Tạo thẻ thành công!");
        dispatch(
          showToast({
            message: "Card added successfully",
            type: "success",
            duration: 3000,
          })
        );

        if (onSave) {
          await onSave(cardResponse.data.data || finalCardData);
        }

        onClose();
      } else {
        const errorMessage = `Lỗi (${cardResponse.data.retCode}): ${cardResponse.data.message}`;
        setResponse(errorMessage);
        dispatch(
          showToast({
            message: errorMessage,
            type: "error",
            duration: 3000,
          })
        );
      }
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage = error.message || "Không thể kết nối đến server";
      setResponse(`Lỗi: ${errorMessage}`);
      dispatch(
        showToast({
          message: errorMessage,
          type: "error",
          duration: 3000,
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl animate-float"></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary-300/20 rounded-full blur-2xl animate-float-slow"></div>

      {/* Card Type Header */}
      <div
        className="bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:via-emerald-800/20 dark:to-emerald-900/30 
        rounded-2xl shadow-xl border-2 border-emerald-200/60 dark:border-emerald-700/30 overflow-hidden transition-all duration-300 hover:shadow-xl"
      >
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 dark:from-emerald-900 dark:via-emerald-800 dark:to-emerald-700 px-6 py-4 flex items-center">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
            <RiIdCardLine className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Card</h3>
          <button
            type="button"
            className="ml-auto text-white/80 hover:text-white transition-colors duration-200"
            onClick={onBack}
          >
            Thay đổi
          </button>
        </div>
      </div>

      {/* Section: Contract Selection */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-gray-800 dark:via-teal-900/20 dark:to-emerald-900/30 rounded-2xl shadow-xl border-2 border-teal-200/60 dark:border-teal-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-teal-400 dark:from-teal-900 dark:via-teal-800 dark:to-teal-600 px-6 py-4 flex items-center">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
            <RiIdCardLine className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">
            Contract Selection
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Liability Contract */}
            <div>
              <Select
                label="Liability Contract*"
                value={selectedLiability}
                onChange={handleLiabilityChange}
                className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 dark:text-gray-300 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                required
                disabled={
                  isLoadingLiabilityContracts || liabilityContracts.length === 0
                }
              >
                <option value="">Select a Liability Contract</option>
                {liabilityContracts.map((contract) => (
                  <option key={contract.id} value={contract.contractNumber}>
                    {contract.title} ({contract.contractNumber})
                  </option>
                ))}
              </Select>
              {isLoadingLiabilityContracts && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Loading liability contracts...
                </p>
              )}
              {liabilityContractError && !isLoadingLiabilityContracts && (
                <p className="text-sm text-red-500 dark:text-red-400 mt-2">
                  {liabilityContractError}
                </p>
              )}
            </div>

            {/* Issuing Contract */}
            <div>
              {selectedLiability ? (
                <>
                  <Select
                    label="Issuing Contract (Optional)"
                    value={selectedIssuing}
                    onChange={handleIssuingChange}
                    className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 dark:text-gray-300 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                    disabled={
                      isAutoGenerateIssue ||
                      (isLoadingIssuingContracts &&
                        issuingContracts.length === 0)
                    }
                  >
                    <option value="">
                      Select an Issuing Contract you want to issue
                    </option>
                    {issuingContracts.map((contract) => (
                      <option key={contract.id} value={contract.contractNumber}>
                        {contract.title} ({contract.contractNumber})
                      </option>
                    ))}
                  </Select>
                  {isLoadingIssuingContracts && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Loading issuing contracts...
                    </p>
                  )}
                  {issuingContracts.length === 0 &&
                    !isLoadingIssuingContracts && (
                      <div className="mt-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={isAutoGenerateIssue}
                            onChange={(e) =>
                              setIsAutoGenerateIssue(e.target.checked)
                            }
                            className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Auto-generate Issuing Contract
                          </span>
                        </label>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          No issuing contracts found. Check this to
                          auto-generate one.
                        </p>
                      </div>
                    )}
                  {issuingContractError &&
                    !isLoadingIssuingContracts &&
                    issuingContracts.length === 0 && (
                      <p className="text-sm text-red-500 dark:text-red-400 mt-2">
                        {issuingContractError}
                      </p>
                    )}
                </>
              ) : (
                <div className="opacity-50">
                  <Select
                    label="Issuing Contract (Optional)"
                    value=""
                    onChange={() => {}}
                    disabled
                    className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 dark:text-gray-300 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300"
                  >
                    <option value="">Select a Liability Contract first</option>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contract Search Information */}
      {selectedLiability && (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-gray-800 dark:via-teal-900/20 dark:to-emerald-900/30 rounded-2xl shadow-xl border-2 border-teal-200/60 dark:border-teal-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-teal-400 dark:from-teal-900 dark:via-teal-800 dark:to-teal-600 px-6 py-4 flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
              <RiIdCardLine className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Contract Search Information
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Select
                  label="Contract Search Method*"
                  value={cardData.contractSearchMethod}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleCardDataChange("contractSearchMethod", e.target.value)
                  }
                  className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                  required
                >
                  <option value="CONTRACT_NUMBER">CONTRACT_NUMBER</option>
                  <option value="CONTRACT_ID">CONTRACT_ID</option>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Issuing Contract Identifier*"
                  value={cardData.contractIdentifier}
                  onChange={(e) =>
                    handleCardDataChange("contractIdentifier", e.target.value)
                  }
                  className={`py-2.5 pl-4 w-full border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500 ${
                    isAutoGenerateIssue
                      ? "bg-gray-200/80 dark:bg-gray-600/70 opacity-50 cursor-not-allowed"
                      : "bg-white/80 dark:bg-gray-700/70"
                  }`}
                  required
                  disabled={isAutoGenerateIssue}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card Information */}
      {selectedLiability && (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-gray-800 dark:via-teal-900/20 dark:to-emerald-900/30 rounded-2xl shadow-xl border-2 border-teal-200/60 dark:border-teal-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-teal-400 dark:from-teal-900 dark:via-teal-800 dark:to-teal-600 px-6 py-4 flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
              <RiIdCardLine className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Card Information
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Card Name*"
                  value={cardData.cardName}
                  onChange={(e) =>
                    handleCardDataChange("cardName", e.target.value)
                  }
                  className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                  required
                />
              </div>
              <div>
                <Input
                  label="CBS Number"
                  value={cardData.cbsNumber}
                  onChange={(e) =>
                    handleCardDataChange("cbsNumber", e.target.value)
                  }
                  className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Product Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Input
                    label="Product Code*"
                    value={cardData.productCode}
                    onChange={(e) =>
                      handleCardDataChange("productCode", e.target.value)
                    }
                    className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Product Code 2"
                    value={cardData.productCode2}
                    onChange={(e) =>
                      handleCardDataChange("productCode2", e.target.value)
                    }
                    className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                  />
                </div>
                <div>
                  <Input
                    label="Product Code 3"
                    value={cardData.productCode3}
                    onChange={(e) =>
                      handleCardDataChange("productCode3", e.target.value)
                    }
                    className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Embossed Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Input
                    label="Embossed First Name*"
                    value={cardData.embossedFirstName}
                    onChange={(e) =>
                      handleCardDataChange("embossedFirstName", e.target.value)
                    }
                    className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Embossed Last Name*"
                    value={cardData.embossedLastName}
                    onChange={(e) =>
                      handleCardDataChange("embossedLastName", e.target.value)
                    }
                    className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Embossed Company Name"
                    value={cardData.embossedCompanyName}
                    onChange={(e) =>
                      handleCardDataChange(
                        "embossedCompanyName",
                        e.target.value
                      )
                    }
                    className="py-2.5 pl-4 w-full bg-white/80 backdrop-blur-sm dark:bg-gray-700/70 border-teal-200 dark:border-teal-700/50 dark:placeholder-gray-400 transition-all duration-300 focus:shadow-md focus:border-teal-400 dark:focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-gray-800 dark:via-teal-900/20 dark:to-emerald-900/30 rounded-2xl shadow-xl border-2 border-teal-200/60 dark:border-teal-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-teal-400 dark:from-teal-900 dark:via-teal-800 dark:to-teal-600 px-6 py-4 flex items-center">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-3 shadow-lg">
              <RiInformationLine className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Kết quả</h3>
          </div>
          <div className="p-6">
            <div
              className={`p-4 rounded-xl text-center text-lg font-medium shadow-inner ${
                response.includes("Lỗi")
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
          onClick={onBack}
          variant="secondary"
          icon={RiArrowLeftLine}
          className="transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-700/80 border-teal-200 dark:border-teal-700/50"
        >
          Back
        </Button>
        <Button
          onClick={onClose}
          variant="secondary"
          className="transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-700/80 border-teal-200 dark:border-teal-700/50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon={RiAddLine}
          disabled={
            isSubmitting ||
            !selectedLiability ||
            isLoadingLiabilityContracts ||
            liabilityContracts.length === 0
          }
          className="px-5 py-3 text-base shadow-lg hover:shadow-xl bg-emerald-600 text-white hover:bg-emerald-500 dark:bg-emerald-700 dark:hover:bg-emerald-600 transition-all duration-300 transform hover:-translate-y-1 border-2 border-emerald-300/20"
        >
          {isSubmitting ? "Processing..." : "Add Card"}
        </Button>
      </div>
    </form>
  );
}
