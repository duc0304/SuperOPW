import { RiAddLine, RiFileTextLine, RiExchangeFundsLine } from "react-icons/ri";
import Button from "@/components/ui/Button";

interface CardCreationOptionsProps {
  onSelectLiability: () => void;
  onSelectIssuing: () => void;
  onBack: () => void;
}

export default function CardCreationOptions({
  onSelectLiability,
  onSelectIssuing,
  onBack,
}: CardCreationOptionsProps) {
  return (
    <div className="py-8">
      {/* Header Card */}
      <div className="flex justify-center mb-8">
        <div
          className="bg-emerald-100 dark:bg-emerald-800/30 
          rounded-2xl shadow-xl border-2 border-emerald-700 dark:border-emerald-700/30 overflow-hidden transition-all duration-300 hover:shadow-xl inline-block"
        >
          <div className="bg-emerald-700 dark:bg-emerald-700 px-6 py-4">
            <h2 className="text-2xl font-bold text-center text-white">
              Choose Card Creation Option
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Option 1: Create Card via Liability (Auto-create Issuing) */}
        <div
          className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 dark:from-blue-900/20 dark:via-blue-800/15 dark:to-blue-900/20 
            rounded-2xl shadow-lg border-2 border-blue-200/60 dark:border-blue-700/30 overflow-hidden 
            transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
          onClick={onSelectLiability}
        >
          <div className="p-6 flex flex-col items-center text-center">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full mb-4">
              <RiFileTextLine className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Via Liability Contract
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Create Card via Liability; Issuing contract auto-generated.
            </p>
            <div className="mt-auto">
              <Button
                variant="primary"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                icon={RiAddLine}
                onClick={onSelectLiability}
              >
                Select
              </Button>
            </div>
          </div>
        </div>

        {/* Option 2: Create Card via Specific Issuing Contract */}
        <div
          className="bg-gradient-to-br from-violet-50 via-violet-100 to-violet-50 dark:from-violet-900/20 dark:via-violet-800/15 dark:to-violet-900/20 
            rounded-2xl shadow-lg border-2 border-violet-200/60 dark:border-violet-700/30 overflow-hidden 
            transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
          onClick={onSelectIssuing}
        >
          <div className="p-6 flex flex-col items-center text-center">
            <div className="bg-violet-100 dark:bg-violet-900/50 p-4 rounded-full mb-4">
              <RiExchangeFundsLine className="w-12 h-12 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Via Issuing Contract
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Create Card by selecting an existing Issuing contract.
            </p>
            <div className="mt-auto">
              <Button
                variant="primary"
                className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-600"
                icon={RiAddLine}
                onClick={onSelectIssuing}
              >
                Select
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-end mt-8">
        <Button
          onClick={onBack}
          variant="secondary"
          className="transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm dark:bg-gray-700/80 border-purple-400 dark:border-purple-500"
        >
          Back
        </Button>
      </div>
    </div>
  );
}
