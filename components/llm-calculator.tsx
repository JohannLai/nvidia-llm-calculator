"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";

// Form schema
const calculatorSchema = z.object({
  parameterCount: z.coerce.number().min(0.1, {
    message: "Parameter count must be at least 0.1 billion",
  }),
  precision: z.string(),
  batchSize: z.coerce.number().min(1, {
    message: "Batch size must be at least 1",
  }),
  sequenceLength: z.coerce.number().min(1, {
    message: "Sequence length must be at least 1",
  }),
  layers: z.coerce.number().min(1, {
    message: "Number of layers must be at least 1",
  }),
  hiddenSize: z.coerce.number().min(1, {
    message: "Hidden size must be at least 1",
  }),
  attentionHeads: z.coerce.number().min(1, {
    message: "Attention heads must be at least 1",
  }),
  trainablePercentage: z.coerce.number().min(0).max(100, {
    message: "Percentage must be between 0 and 100",
  }),
});

// Define form data type
type CalculatorFormData = z.infer<typeof calculatorSchema>;

// Precision lookup
const precisionBytes = {
  "32": 4, // FP32
  "16": 2, // FP16
  "8": 1, // INT8
  "4": 0.5, // INT4
};

// Function to calculate memory requirements
function calculateMemoryRequirements(values: CalculatorFormData) {
  // Convert parameter count to actual parameters (billions to actual number)
  const totalParams = values.parameterCount * 1000000000;

  // Get precision in bytes
  const precisionInBytes =
    precisionBytes[values.precision as keyof typeof precisionBytes];

  // Calculate model size in bytes
  const modelSizeBytes = totalParams * precisionInBytes;

  // Calculate KV cache
  const kvCacheBytes =
    2 *
    values.batchSize *
    values.sequenceLength *
    values.layers *
    values.hiddenSize *
    precisionInBytes;

  // Calculate activation memory
  const activationBytes =
    values.batchSize *
    values.sequenceLength *
    values.hiddenSize *
    (34 +
      (5 * values.sequenceLength * values.attentionHeads) / values.hiddenSize) *
    4; // Activations are in FP32

  // Calculate training memory (optimizer states + gradients)
  // Only applied to trainable parameters
  const trainableParams = totalParams * (values.trainablePercentage / 100);
  const optimizerStateBytes = trainableParams * 8; // AdamW with 2 states at FP32
  const gradientBytes = trainableParams * 4; // Gradients are stored in FP32

  // Calculate total memory requirements
  const inferenceMemoryBytes = modelSizeBytes + kvCacheBytes + activationBytes;
  const trainingMemoryBytes =
    inferenceMemoryBytes + optimizerStateBytes + gradientBytes;

  // Convert to GB
  const inferenceMemoryGB = inferenceMemoryBytes / (1024 * 1024 * 1024);
  const trainingMemoryGB = trainingMemoryBytes / (1024 * 1024 * 1024);

  return {
    inferenceMemoryGB: inferenceMemoryGB.toFixed(2),
    trainingMemoryGB: trainingMemoryGB.toFixed(2),
    modelSizeGB: (modelSizeBytes / (1024 * 1024 * 1024)).toFixed(2),
    kvCacheGB: (kvCacheBytes / (1024 * 1024 * 1024)).toFixed(2),
    activationGB: (activationBytes / (1024 * 1024 * 1024)).toFixed(2),
    optimizerStateGB: (optimizerStateBytes / (1024 * 1024 * 1024)).toFixed(2),
    gradientGB: (gradientBytes / (1024 * 1024 * 1024)).toFixed(2),
  };
}

// Function to recommend GPUs based on memory requirements
function recommendGPUs(memoryGB: number) {
  const gpus = [
    { name: "NVIDIA A100 (80GB)", memory: 80 },
    { name: "NVIDIA A100 (40GB)", memory: 40 },
    { name: "NVIDIA H100 (80GB)", memory: 80 },
    { name: "NVIDIA H100 PCIe (80GB)", memory: 80 },
    { name: "NVIDIA L40S", memory: 48 },
    { name: "NVIDIA L40", memory: 48 },
    { name: "NVIDIA A40", memory: 48 },
    { name: "NVIDIA A30", memory: 24 },
    { name: "NVIDIA A10", memory: 24 },
    { name: "NVIDIA RTX 6000 Ada", memory: 48 },
    { name: "NVIDIA RTX A6000", memory: 48 },
    { name: "NVIDIA RTX 4090", memory: 24 },
    { name: "NVIDIA V100 (32GB)", memory: 32 },
    { name: "NVIDIA V100 (16GB)", memory: 16 },
    { name: "NVIDIA T4", memory: 16 },
  ];

  // Filter GPUs that have enough memory
  const singleGpu = gpus.filter(
    (gpu) => gpu.memory >= parseFloat(memoryGB.toString())
  );

  // Calculate multi-GPU configurations for those that don't fit on a single GPU
  const multiGpu = [];
  if (singleGpu.length === 0) {
    for (const gpu of gpus) {
      const numGpus = Math.ceil(parseFloat(memoryGB.toString()) / gpu.memory);
      if (numGpus <= 8) {
        // Limit to reasonable configurations
        multiGpu.push({
          name: gpu.name,
          count: numGpus,
          totalMemory: gpu.memory * numGpus,
        });
      }
    }
    // Sort by number of GPUs needed
    multiGpu.sort((a, b) => a.count - b.count);
  }

  return { singleGpu, multiGpu };
}

// Models for quick selection
const popularModels = [
  { id: "choose", name: "models.choose", value: null },
  {
    id: "llama3-8b",
    name: "models.llama3_8b",
    value: {
      parameterCount: 8,
      layers: 32,
      hiddenSize: 4096,
      attentionHeads: 32,
    },
  },
  {
    id: "llama3-70b",
    name: "models.llama3_70b",
    value: {
      parameterCount: 70,
      layers: 80,
      hiddenSize: 8192,
      attentionHeads: 64,
    },
  },
  {
    id: "qwen2-7b",
    name: "models.qwen2_7b",
    value: {
      parameterCount: 7,
      layers: 32,
      hiddenSize: 4096,
      attentionHeads: 32,
    },
  },
  {
    id: "mixtral-8x7b",
    name: "models.mixtral",
    value: {
      parameterCount: 47,
      layers: 32,
      hiddenSize: 4096,
      attentionHeads: 32,
    },
  },
  {
    id: "gemma2-9b",
    name: "models.gemma2",
    value: {
      parameterCount: 9,
      layers: 28,
      hiddenSize: 3072,
      attentionHeads: 16,
    },
  },
  {
    id: "deepseek-7b",
    name: "models.deepseek",
    value: {
      parameterCount: 7,
      layers: 32,
      hiddenSize: 4096,
      attentionHeads: 32,
    },
  },
];

export function LlmCalculator() {
  const t = useTranslations("calculator");
  const [activeTab, setActiveTab] = useState("calculator");
  const [results, setResults] = useState<{
    inferenceMemoryGB: string;
    trainingMemoryGB: string;
    modelSizeGB: string;
    kvCacheGB: string;
    activationGB: string;
    optimizerStateGB: string;
    gradientGB: string;
  } | null>(null);

  const [recommendations, setRecommendations] = useState<{
    singleGpu: Array<{ name: string; memory: number }>;
    multiGpu: Array<{ name: string; count: number; totalMemory: number }>;
  } | null>(null);

  const form = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      parameterCount: 7,
      precision: "16",
      batchSize: 1,
      sequenceLength: 2048,
      layers: 32,
      hiddenSize: 4096,
      attentionHeads: 32,
      trainablePercentage: 100,
    },
  });

  const onSubmit: SubmitHandler<CalculatorFormData> = (values) => {
    try {
      console.log("Form submitted with values:", values);
      const memoryRequirements = calculateMemoryRequirements(values);
      setResults(memoryRequirements);

      // Get GPU recommendations
      const gpuRecommendations = recommendGPUs(
        Number(memoryRequirements.inferenceMemoryGB)
      );
      setRecommendations(gpuRecommendations);

      // Switch to results tab
      setActiveTab("results");
    } catch (error) {
      console.error("Error calculating results:", error);
    }
  };

  function handleModelSelect(modelId: string) {
    if (modelId === "choose") return;

    const selectedModel = popularModels.find((model) => model.id === modelId);

    if (selectedModel && selectedModel.value) {
      form.setValue("parameterCount", selectedModel.value.parameterCount);
      form.setValue("layers", selectedModel.value.layers);
      form.setValue("hiddenSize", selectedModel.value.hiddenSize);
      form.setValue("attentionHeads", selectedModel.value.attentionHeads);
    }
  }

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="calculator">{t("tabs.calculator")}</TabsTrigger>
            <TabsTrigger value="results">{t("tabs.results")}</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="mb-6">
                  <FormLabel>{t("form.quickSelection.label")}</FormLabel>
                  <Select onValueChange={handleModelSelect}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("form.quickSelection.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {popularModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {t(model.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("form.quickSelection.description")}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="parameterCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.parameterCount.label")}</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormDescription>
                          {t("form.parameterCount.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="precision"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.precision.label")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("form.precision.label")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="32">
                              {t("form.precision.options.fp32")}
                            </SelectItem>
                            <SelectItem value="16">
                              {t("form.precision.options.fp16")}
                            </SelectItem>
                            <SelectItem value="8">
                              {t("form.precision.options.int8")}
                            </SelectItem>
                            <SelectItem value="4">
                              {t("form.precision.options.int4")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {t("form.precision.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="batchSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.batchSize.label")}</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          {t("form.batchSize.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sequenceLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.sequenceLength.label")}</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          {t("form.sequenceLength.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="layers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.layers.label")}</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          {t("form.layers.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hiddenSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.hiddenSize.label")}</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          {t("form.hiddenSize.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="attentionHeads"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.attentionHeads.label")}</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          {t("form.attentionHeads.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="trainablePercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("form.trainablePercentage.label")}
                        </FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormDescription>
                          {t("form.trainablePercentage.description")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {t("form.submitButton")}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="results">
            {results ? (
              <div className="space-y-6">
                <h3 className="text-lg font-bold mb-3">
                  {t("results.memoryRequirements")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("results.inference.title")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {results.inferenceMemoryGB} GB
                      </p>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm">
                          {t("results.inference.modelSize")}:{" "}
                          {results.modelSizeGB} GB
                        </p>
                        <p className="text-sm">
                          {t("results.inference.kvCache")}: {results.kvCacheGB}{" "}
                          GB
                        </p>
                        <p className="text-sm">
                          {t("results.inference.activations")}:{" "}
                          {results.activationGB} GB
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t("results.training.title")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {results.trainingMemoryGB} GB
                      </p>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm">
                          {t("results.training.optimizerStates")}:{" "}
                          {results.optimizerStateGB} GB
                        </p>
                        <p className="text-sm">
                          {t("results.training.gradients")}:{" "}
                          {results.gradientGB} GB
                        </p>
                        <p className="text-sm">
                          {t("results.training.plusInference")}:{" "}
                          {results.inferenceMemoryGB} GB
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {recommendations && (
                  <>
                    <h3 className="text-lg font-bold mt-8 mb-3">
                      {t("results.gpuRecommendations.title")}
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-md font-semibold mb-3">
                          {t("results.gpuRecommendations.singleGpu.title")}
                        </h4>
                        {recommendations.singleGpu.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recommendations.singleGpu.map((gpu, index) => (
                              <Card key={index} className="bg-green-50">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-md">
                                    {gpu.name}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm">
                                    {t("memory.memory")}: {gpu.memory} GB
                                  </p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <p className="text-amber-600">
                            {t(
                              "results.gpuRecommendations.singleGpu.noOptions"
                            )}
                          </p>
                        )}
                      </div>

                      {recommendations.multiGpu.length > 0 && (
                        <div>
                          <h4 className="text-md font-semibold mb-3">
                            {t("results.gpuRecommendations.multiGpu.title")}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recommendations.multiGpu
                              .slice(0, 6)
                              .map((config, index) => (
                                <Card key={index} className="bg-blue-50">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-md">
                                      {config.count}x {config.name}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-sm">
                                      {t("memory.totalMemory")}:{" "}
                                      {config.totalMemory} GB
                                    </p>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-gray-100 p-4 rounded">
                        <h4 className="text-md font-semibold mb-2">
                          {t("results.gpuRecommendations.note.title")}
                        </h4>
                        <p className="text-sm">
                          {t("results.gpuRecommendations.note.content")}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">
                {t("results.noResults")}
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
