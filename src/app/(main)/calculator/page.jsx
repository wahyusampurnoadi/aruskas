"use client";

import { useState } from "react";
import Header from "@/components/calculator/Header";
import Form from "@/components/calculator/Form";
import Result from "@/components/calculator/Result";

export default function CalculatorPage() {
  const [mode, setMode] = useState("target");

  const [targetAmount, setTargetAmount] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [targetMonths, setTargetMonths] = useState("");
  const [annualReturn, setAnnualReturn] = useState("");

  const formatRp = (val) => {
    const validVal = Math.max(0, val || 0);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(validVal);
  };

  const numTarget = Number(targetAmount) || 0;
  const numSavings = Number(currentSavings) || 0;
  const numContribution = Number(monthlyContribution) || 0;
  const numMonths = Number(targetMonths) || 0;
  const numReturn = Number(annualReturn) || 0;

  const remainingTarget = Math.max(0, numTarget - numSavings);

  const monthlyRate = numReturn > 0 ? numReturn / 100 / 12 : 0;

  // --- KALKULASI INVESTASI ---
  const calculateEstimatedMonths = () => {
    if (numTarget <= numSavings) return 0;
    if (numContribution <= 0 && numReturn <= 0) return 0;

    let months = 0;
    let balance = numSavings;
    const maxMonths = 1200;

    while (balance < numTarget && months < maxMonths) {
      balance += balance * monthlyRate;
      balance += numContribution;
      months++;
    }

    return months >= maxMonths ? 0 : months;
  };

  const calculateRequiredMonthly = () => {
    if (numTarget <= numSavings || numMonths <= 0) return 0;

    if (monthlyRate === 0) {
      return Math.ceil((numTarget - numSavings) / numMonths);
    }

    const futureSavings = numSavings * Math.pow(1 + monthlyRate, numMonths);
    const neededFromMonthly = numTarget - futureSavings;

    if (neededFromMonthly <= 0) return 0;

    const pmt =
      neededFromMonthly *
      (monthlyRate / (Math.pow(1 + monthlyRate, numMonths) - 1));

    return Math.ceil(pmt);
  };

  const estimatedMonthsNeeded = calculateEstimatedMonths();
  const requiredMonthlySavings = calculateRequiredMonthly();

  const handleReset = () => {
    setTargetAmount("");
    setCurrentSavings("");
    setMonthlyContribution("");
    setTargetMonths("");
    setAnnualReturn("");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen select-none space-y-8 max-w-7xl mx-auto">
      <Header mode={mode} setMode={setMode} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Form
          mode={mode}
          targetAmount={targetAmount}
          setTargetAmount={setTargetAmount}
          currentSavings={currentSavings}
          setCurrentSavings={setCurrentSavings}
          monthlyContribution={monthlyContribution}
          setMonthlyContribution={setMonthlyContribution}
          targetMonths={targetMonths}
          setTargetMonths={setTargetMonths}
          annualReturn={annualReturn}
          setAnnualReturn={setAnnualReturn}
          onReset={handleReset}
        />

        <Result
          mode={mode}
          targetAmount={numTarget}
          currentSavings={numSavings}
          remainingTarget={remainingTarget}
          estimatedMonthsNeeded={estimatedMonthsNeeded}
          requiredMonthlySavings={requiredMonthlySavings}
          formatRp={formatRp}
        />
      </div>
    </div>
  );
}