"use client";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { IFormInput } from "@/types/types"; // Import type definition for form data
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddBetModalProps {
  openModal: boolean;
  closeModal: () => void;
}

const AddBetModal = ({ openModal, closeModal }: AddBetModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
    reset,
  } = useForm<IFormInput>();

  const outcome = watch("outcome");

  // On form submit
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);

    try {
      const response = await axios.post("/api/bets", data);
      console.log("Bet added successfully:", response.data);

      reset();
      router.refresh();
      closeModal();
    } catch (error) {
      console.error("Error adding bet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Watch outcome change and trigger validation for reducedOdds if outcome is "Void"
  useEffect(() => {
    if (outcome === "Void") {
      setValue("reducedOdds", undefined);
      trigger("reducedOdds");
    } else {
      setValue("reducedOdds", undefined);
    }
  }, [outcome, setValue, trigger]);

  if (!openModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-100 text-black p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Add Bet</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Stake Field */}
          <div>
            <label htmlFor="stake" className="block text-sm font-medium pb-1">
              Stake
            </label>
            <Input
              id="stake"
              type="number"
              step="0.01"
              {...register("stake", { required: "Stake is required" })}
            />
            {errors.stake && (
              <p className="text-sm text-red-600 mt-1">
                {errors.stake?.message}
              </p>
            )}
          </div>

          {/* Odds Field */}
          <div>
            <label htmlFor="odds" className="block text-sm font-medium pb-1">
              Odds
            </label>
            <Input
              id="odds"
              type="number"
              step="0.01"
              {...register("odds", { required: "Odds are required" })}
            />
            {errors.odds && (
              <p className="text-sm text-red-600 mt-1">
                {errors.odds?.message}
              </p>
            )}
          </div>

          {/* Outcome Field */}
          <div>
            <label htmlFor="outcome" className="block text-sm font-medium pb-1">
              Outcome
            </label>
            <Select
              onValueChange={(value: "Win" | "Loss" | "Void") => {
                setValue("outcome", value);
                trigger("outcome");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an Outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Outcomes</SelectLabel>
                  <SelectItem value="Win">Win</SelectItem>
                  <SelectItem value="Loss">Loss</SelectItem>
                  <SelectItem value="Void">Void</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.outcome && (
              <p className="text-sm text-red-600 mt-1">
                {errors.outcome?.message}
              </p>
            )}
          </div>

          {/* Reduced Odds Field */}
          {outcome === "Void" && (
            <div>
              <label
                htmlFor="reducedOdds"
                className="block text-sm font-medium pb-1"
              >
                Reduced Odds
              </label>

              <Input
                id="reducedOdds"
                type="number"
                step="0.01"
                {...register("reducedOdds", {
                  required: "Reduced odds are required when outcome is Void",
                })}
              />

              {errors.reducedOdds && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.reducedOdds?.message}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-between mt-6">
            <Button variant="outline" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Adding...
                </>
              ) : (
                "Add Bet"
              )}
            </Button>
            <Button variant="outline" onClick={closeModal}>
              Close
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBetModal;
