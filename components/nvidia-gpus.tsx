"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";

// GPU Data based on the provided information in the Wikipedia article
const nvidiaGpus = [
  // Tesla Series
  {
    name: "NVIDIA Tesla H200 NVL",
    memory: 141,
    memoryType: "HBM3e",
    tdp: 600,
    series: "Tesla",
    architecture: "Hopper",
    year: 2024,
    cudaCores: 16896,
    tensorCores: true,
    rtCores: false,
    application: "Data Center",
  },
  {
    name: "NVIDIA Tesla H100 SXM5",
    memory: 80,
    memoryType: "HBM3",
    tdp: 700,
    series: "Tesla",
    architecture: "Hopper",
    year: 2022,
    cudaCores: 16896,
    tensorCores: true,
    rtCores: false,
    application: "Data Center",
  },
  {
    name: "NVIDIA Tesla H100 SXM5",
    memory: 80,
    memoryType: "HBM3",
    tdp: 700,
    series: "Tesla",
    architecture: "Hopper",
    year: 2022,
    cudaCores: 16896,
    tensorCores: true,
    rtCores: false,
    application: "Data Center",
  },
  {
    name: "NVIDIA Tesla H100 PCIe",
    memory: 80,
    memoryType: "HBM2e",
    tdp: 350,
    series: "Tesla",
    architecture: "Hopper",
    year: 2022,
    cudaCores: 14592,
    tensorCores: true,
    rtCores: false,
    application: "Data Center",
  },
  {
    name: "NVIDIA Tesla A100 (80GB)",
    memory: 80,
    memoryType: "HBM2",
    tdp: 400,
    series: "Tesla",
    architecture: "Ampere",
    year: 2020,
    cudaCores: 6912,
    tensorCores: true,
    rtCores: false,
    application: "Data Center",
  },
  {
    name: "NVIDIA Tesla A100 (40GB)",
    memory: 40,
    memoryType: "HBM2",
    tdp: 400,
    series: "Tesla",
    architecture: "Ampere",
    year: 2020,
    cudaCores: 6912,
    tensorCores: true,
    rtCores: false,
    application: "Data Center",
  },
  {
    name: "NVIDIA Tesla A40",
    memory: 48,
    memoryType: "GDDR6",
    tdp: 300,
    series: "Tesla",
    architecture: "Ampere",
    year: 2020,
    cudaCores: 10752,
    tensorCores: true,
    rtCores: true,
    application: "Data Center",
  },
  {
    name: "NVIDIA Tesla A30",
    memory: 24,
    memoryType: "HBM2",
    tdp: 165,
    series: "Tesla",
    architecture: "Ampere",
    year: 2021,
    cudaCores: 3584,
    tensorCores: true,
    rtCores: false,
    application: "Data Center",
  },
  {
    name: "NVIDIA Tesla A10",
    memory: 24,
    memoryType: "GDDR6",
    tdp: 150,
    series: "Tesla",
    architecture: "Ampere",
    year: 2021,
    cudaCores: 9216,
    tensorCores: true,
    rtCores: true,
    application: "Data Center",
  },
  {
    name: "NVIDIA Tesla A2",
    memory: 16,
    memoryType: "GDDR6",
    tdp: 60,
    series: "Tesla",
    architecture: "Ampere",
    year: 2021,
    cudaCores: 1280,
    tensorCores: true,
    rtCores: false,
    application: "Data Center",
  },
  {
    name: "NVIDIA Tesla V100 (32GB)",
    memory: 32,
    memoryType: "HBM2",
    tdp: 300,
    series: "Tesla",
    architecture: "Volta",
    year: 2018,
    cudaCores: 5120,
    tensorCores: true,
    rtCores: false,
    application: "Data Center",
  },
  {
    name: "NVIDIA Tesla V100 (16GB)",
    memory: 16,
    memoryType: "HBM2",
    tdp: 300,
    series: "Tesla",
    architecture: "Volta",
    year: 2017,
    cudaCores: 5120,
    tensorCores: true,
    rtCores: false,
    application: "Data Center",
  },
  {
    name: "NVIDIA Tesla T4",
    memory: 16,
    memoryType: "GDDR6",
    tdp: 70,
    series: "Tesla",
    architecture: "Turing",
    year: 2018,
    cudaCores: 2560,
    tensorCores: true,
    rtCores: true,
    application: "Data Center",
  },
  {
    name: "NVIDIA Tesla P100 (16GB)",
    memory: 16,
    memoryType: "HBM2",
    tdp: 250,
    series: "Tesla",
    architecture: "Pascal",
    year: 2016,
    cudaCores: 3584,
    tensorCores: false,
    rtCores: false,
    application: "Data Center",
  },
  {
    name: "NVIDIA Tesla P40",
    memory: 24,
    memoryType: "GDDR5",
    tdp: 250,
    series: "Tesla",
    architecture: "Pascal",
    year: 2016,
    cudaCores: 3840,
    tensorCores: false,
    rtCores: false,
    application: "Data Center",
  },

  // RTX Series (Workstation)
  {
    name: "NVIDIA RTX 6000 Ada",
    memory: 48,
    memoryType: "GDDR6",
    tdp: 300,
    series: "RTX Workstation",
    architecture: "Ada Lovelace",
    year: 2022,
    cudaCores: 18176,
    tensorCores: true,
    rtCores: true,
    application: "Workstation",
  },
  {
    name: "NVIDIA RTX A6000",
    memory: 48,
    memoryType: "GDDR6",
    tdp: 300,
    series: "RTX Workstation",
    architecture: "Ampere",
    year: 2020,
    cudaCores: 10752,
    tensorCores: true,
    rtCores: true,
    application: "Workstation",
  },
  {
    name: "NVIDIA RTX A5000",
    memory: 24,
    memoryType: "GDDR6",
    tdp: 230,
    series: "RTX Workstation",
    architecture: "Ampere",
    year: 2021,
    cudaCores: 8192,
    tensorCores: true,
    rtCores: true,
    application: "Workstation",
  },
  {
    name: "NVIDIA RTX A4000",
    memory: 16,
    memoryType: "GDDR6",
    tdp: 140,
    series: "RTX Workstation",
    architecture: "Ampere",
    year: 2021,
    cudaCores: 6144,
    tensorCores: true,
    rtCores: true,
    application: "Workstation",
  },

  // Data Center GPUs
  {
    name: "NVIDIA L40",
    memory: 48,
    memoryType: "GDDR6",
    tdp: 300,
    series: "L-Series",
    architecture: "Ada Lovelace",
    year: 2022,
    cudaCores: 18176,
    tensorCores: true,
    rtCores: true,
    application: "Data Center",
  },
  {
    name: "NVIDIA L4",
    memory: 24,
    memoryType: "GDDR6",
    tdp: 72,
    series: "L-Series",
    architecture: "Ada Lovelace",
    year: 2023,
    cudaCores: 7424,
    tensorCores: true,
    rtCores: true,
    application: "Data Center",
  },

  // Consumer GPUs (for reference)
  {
    name: "NVIDIA GeForce RTX 4090",
    memory: 24,
    memoryType: "GDDR6X",
    tdp: 450,
    series: "GeForce",
    architecture: "Ada Lovelace",
    year: 2022,
    cudaCores: 16384,
    tensorCores: true,
    rtCores: true,
    application: "Consumer",
  },
  {
    name: "NVIDIA GeForce RTX 3090",
    memory: 24,
    memoryType: "GDDR6X",
    tdp: 350,
    series: "GeForce",
    architecture: "Ampere",
    year: 2020,
    cudaCores: 10496,
    tensorCores: true,
    rtCores: true,
    application: "Consumer",
  },
];

// Define filter options for each category
const seriesOptions = Array.from(
  new Set(nvidiaGpus.map((gpu) => gpu.series))
).map((series) => ({ value: series, label: series }));

const architectureOptions = Array.from(
  new Set(nvidiaGpus.map((gpu) => gpu.architecture))
).map((arch) => ({ value: arch, label: arch }));

const memoryOptions = Array.from(new Set(nvidiaGpus.map((gpu) => gpu.memory)))
  .sort((a, b) => a - b)
  .map((memory) => ({ value: memory.toString(), label: `${memory}GB+` }));

const applicationOptions = Array.from(
  new Set(nvidiaGpus.map((gpu) => gpu.application))
).map((app) => ({ value: app, label: app }));

export function NvidiaGpus() {
  const t = useTranslations("gpus");
  const [searchTerm, setSearchTerm] = useState("");
  const [seriesFilter, setSeriesFilter] = useState("all");
  const [architectureFilter, setArchitectureFilter] = useState("all");
  const [applicationFilter, setApplicationFilter] = useState("all");
  const [minMemory, setMinMemory] = useState("all");

  // Filter GPUs based on search and filter criteria
  const filteredGpus = nvidiaGpus.filter((gpu) => {
    // Search term filter
    const matchesSearch = gpu.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Series filter
    const matchesSeries = seriesFilter === "all" || gpu.series === seriesFilter;

    // Architecture filter
    const matchesArchitecture =
      architectureFilter === "all" || gpu.architecture === architectureFilter;

    // Application filter
    const matchesApplication =
      applicationFilter === "all" || gpu.application === applicationFilter;

    // Memory filter
    const matchesMemory =
      minMemory === "all" || gpu.memory >= parseInt(minMemory);

    return (
      matchesSearch &&
      matchesSeries &&
      matchesArchitecture &&
      matchesApplication &&
      matchesMemory
    );
  });

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div>
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">
                {t("filters.series")}
              </label>
              <Select value={seriesFilter} onValueChange={setSeriesFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t("filters.allSeries")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filters.allSeries")}</SelectItem>
                  {seriesOptions.map((option) => (
                    <SelectItem
                      key={`series-${option.value}`}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">
                {t("filters.architecture")}
              </label>
              <Select
                value={architectureFilter}
                onValueChange={setArchitectureFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("filters.allArchitectures")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("filters.allArchitectures")}
                  </SelectItem>
                  {architectureOptions.map((option) => (
                    <SelectItem
                      key={`arch-${option.value}`}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">
                {t("filters.minMemory")}
              </label>
              <Select value={minMemory} onValueChange={setMinMemory}>
                <SelectTrigger>
                  <SelectValue placeholder={t("filters.anyMemory")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filters.anyMemory")}</SelectItem>
                  {memoryOptions.map((option) => (
                    <SelectItem
                      key={`memory-${option.value}`}
                      value={option.value}
                    >
                      {t("filters.memoryAmount", { amount: option.value })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">
                {t("filters.application")}
              </label>
              <Select
                value={applicationFilter}
                onValueChange={setApplicationFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("filters.allApplications")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("filters.allApplications")}
                  </SelectItem>
                  {applicationOptions.map((option) => (
                    <SelectItem
                      key={`app-${option.value}`}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">{t("table.gpuName")}</th>
                <th className="text-center py-3 px-4">{t("table.memory")}</th>
                <th className="text-center py-3 px-4">
                  {t("table.memoryType")}
                </th>
                <th className="text-center py-3 px-4">
                  {t("table.architecture")}
                </th>
                <th className="text-center py-3 px-4">{t("table.tdp")}</th>
                <th className="text-center py-3 px-4">
                  {t("table.cudaCores")}
                </th>
                <th className="text-center py-3 px-4">
                  {t("table.tensorCores")}
                </th>
                <th className="text-center py-3 px-4">{t("table.year")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredGpus.length > 0 ? (
                filteredGpus.map((gpu, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="py-3 px-4">{gpu.name}</td>
                    <td className="text-center py-3 px-4">
                      {gpu.memory} {t("table.gb")}
                    </td>
                    <td className="text-center py-3 px-4">{gpu.memoryType}</td>
                    <td className="text-center py-3 px-4">
                      {gpu.architecture}
                    </td>
                    <td className="text-center py-3 px-4">
                      {gpu.tdp} {t("table.watt")}
                    </td>
                    <td className="text-center py-3 px-4">
                      {gpu.cudaCores.toLocaleString()}
                    </td>
                    <td className="text-center py-3 px-4">
                      {gpu.tensorCores ? "✓" : "✗"}
                    </td>
                    <td className="text-center py-3 px-4">{gpu.year}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    {t("table.noResults")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>{t("disclaimer")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
