"use client";
import React, { useState } from "react";
import AddBetModal from "./AddBetModal";
import { Button } from "@/components/ui/button";

export default function BetHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Bets</h1>
        <Button variant="outline" onClick={openModal}>
          Add Bet
        </Button>
      </div>

      <AddBetModal openModal={isModalOpen} closeModal={closeModal} />
    </div>
  );
}
