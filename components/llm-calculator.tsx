"use client"

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Form schema
const calculatorSchema = z.object({
  parameterCount: z.coerce.number().min(0.1, {
    message: "Parameter count must be at least 0.1 billion",
  }),
  precision: z.string().default("16"),
  batchSize: z.coerce.number().min(1, {
    message: "Batch size must be at least 1",
  }).default(1),
  sequenceLength: z.coerce.number().min(1, {
    message: "Sequence length must be at least 1",
  }).default(2048),
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
  }).default(100),
});

type CalculatorFormData = z.infer<typeof calculatorSchema>;

// Precision lookup
const precisionBytes = {
  "32": 4, // FP32
  "16": 2, // FP16
  "8": 1,  // INT8
  "4": 0.5, // INT4
};

// Function to calculate memory requirements
function calculateMemoryRequirements(values: CalculatorFormData) {
  // Convert parameter count to actual parameters (billions to actual number)
  const totalParams = values.parameterCount * 1000000000;
  
  // Get precision in bytes
  const precisionInBytes = precisionBytes[values.precision as keyof typeof precisionBytes];
  
  // Calculate model size in bytes
  const modelSizeBytes = totalParams * precisionInBytes;
  
  // Calculate KV cache
  const kvCacheBytes = 2 * values.batchSize * values.sequenceLength * values.layers * values.hiddenSize * precisionInBytes;
  
  // Calculate activation memory
  const activationBytes = values.batchSize * values.sequenceLength * values.hiddenSize * 
    (34 + (5 * values.sequenceLength * values.attentionHeads) / values.hiddenSize) * 4; // Activations are in FP32
  
  // Calculate training memory (optimizer states + gradients)
  // Only applied to trainable parameters
  const trainableParams = totalParams * (values.trainablePercentage / 100);
  const optimizerStateBytes = trainableParams * 8; // AdamW with 2 states at FP32
  const gradientBytes = trainableParams * 4; // Gradients are stored in FP32
  
  // Calculate total memory requirements
  const inferenceMemoryBytes = modelSizeBytes + kvCacheBytes + activationBytes;
  const trainingMemoryBytes = inferenceMemoryBytes + optimizerStateBytes + gradientBytes;
  
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
  const singleGpu = gpus.filter(gpu => gpu.memory >= parseFloat(memoryGB.toString()));
  
  // Calculate multi-GPU configurations for those that don't fit on a single GPU
  let multiGpu = [];
  if (singleGpu.length === 0) {
    for (const gpu of gpus) {
      const numGpus = Math.ceil(parseFloat(memoryGB.toString()) / gpu.memory);
      if (numGpus <= 8) { // Limit to reasonable configurations
        multiGpu.push({
          name: gpu.name,
          count: numGpus,
          totalMemory: gpu.memory * numGpus
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
  { id: "choose", name: "Choose a model", value: null },
  { id: "llama3-8b", name: "Llama 3 (8B)", value: { parameterCount: 8, layers: 32, hiddenSize: 4096, attentionHeads: 32 } },
  { id: "llama3-70b", name: "Llama 3 (70B)", value: { parameterCount: 70, layers: 80, hiddenSize: 8192, attentionHeads: 64 } },
  { id: "qwen2-7b", name: "Qwen 2 (7B)", value: { parameterCount: 7, layers: 32, hiddenSize: 4096, attentionHeads: 32 } },
  { id: "mixtral-8x7b", name: "Mixtral 8x7B", value: { parameterCount: 47, layers: 32, hiddenSize: 4096, attentionHeads: 32 } },
  { id: "gemma2-9b", name: "Gemma 2 (9B)", value: { parameterCount: 9, layers: 28, hiddenSize: 3072, attentionHeads: 16 } },
  { id: "deepseek-7b", name: "DeepSeek (7B)", value: { parameterCount: 7, layers: 32, hiddenSize: 4096, attentionHeads: 32 } }
];

export function LlmCalculator() {
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
  
  function onSubmit(values: CalculatorFormData) {
    try {
      console.log("Form submitted with values:", values);
      const memoryRequirements = calculateMemoryRequirements(values);
      setResults(memoryRequirements);
      
      // Get GPU recommendations
      const gpuRecommendations = recommendGPUs(Number(memoryRequirements.inferenceMemoryGB));
      setRecommendations(gpuRecommendations);
      
      // Switch to results tab
      setActiveTab("results");
    } catch (error) {
      console.error("Error calculating results:", error);
    }
  }
  
  function handleModelSelect(modelId: string) {
    if (modelId === "choose") return;
    
    const selectedModel = popularModels.find(model => model.id === modelId);
    
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
        <CardTitle>LLM GPU Calculator</CardTitle>
        <CardDescription>
          Calculate GPU memory requirements for LLM inference and training
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="mb-6">
                  <FormLabel>Quick Model Selection</FormLabel>
                  <Select onValueChange={handleModelSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularModels.map((model) => (
                        <SelectItem 
                          key={model.id} 
                          value={model.id}
                        >
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    Select a popular model or customize parameters below
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="parameterCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parameter Count (Billions)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Number of parameters in billions (e.g., 7 for a 7B model)
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
                        <FormLabel>Precision</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select precision" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="32">FP32 (32-bit)</SelectItem>
                            <SelectItem value="16">FP16/BF16 (16-bit)</SelectItem>
                            <SelectItem value="8">INT8 (8-bit)</SelectItem>
                            <SelectItem value="4">INT4 (4-bit)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Precision for model weights
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
                        <FormLabel>Batch Size</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Number of inputs processed simultaneously
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
                        <FormLabel>Sequence Length</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Maximum context length (e.g., 2048, 4096, 8192)
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
                        <FormLabel>Number of Layers</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Number of transformer layers in the model
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
                        <FormLabel>Hidden Size</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Dimension of the model embeddings
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
                        <FormLabel>Attention Heads</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          Number of attention heads
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
                        <FormLabel>Trainable Parameters (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormDescription>
                          Percentage of parameters to train (for LoRA/QLoRA)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="w-full">Calculate GPU Requirements</Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="results">
            {results ? (
              <div className="space-y-6">
                <h3 className="text-lg font-bold mb-3">Memory Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Inference Memory</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{results.inferenceMemoryGB} GB</p>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm">Model Size: {results.modelSizeGB} GB</p>
                        <p className="text-sm">KV Cache: {results.kvCacheGB} GB</p>
                        <p className="text-sm">Activations: {results.activationGB} GB</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Training Memory</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{results.trainingMemoryGB} GB</p>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm">Optimizer States: {results.optimizerStateGB} GB</p>
                        <p className="text-sm">Gradients: {results.gradientGB} GB</p>
                        <p className="text-sm">+ Inference Memory: {results.inferenceMemoryGB} GB</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {recommendations && (
                  <>
                    <h3 className="text-lg font-bold mt-8 mb-3">Recommended GPUs</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-md font-semibold mb-3">Single GPU Options (Inference)</h4>
                        {recommendations.singleGpu.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recommendations.singleGpu.map((gpu, index) => (
                              <Card key={index} className="bg-green-50">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-md">{gpu.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm">Memory: {gpu.memory} GB</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <p className="text-amber-600">No single GPU has enough memory for inference.</p>
                        )}
                      </div>
                      
                      {recommendations.multiGpu.length > 0 && (
                        <div>
                          <h4 className="text-md font-semibold mb-3">Multi-GPU Options (Inference)</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recommendations.multiGpu.slice(0, 6).map((config, index) => (
                              <Card key={index} className="bg-blue-50">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-md">{config.count}x {config.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm">Total Memory: {config.totalMemory} GB</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-gray-100 p-4 rounded">
                        <h4 className="text-md font-semibold mb-2">Note:</h4>
                        <p className="text-sm">
                          These recommendations are based on memory requirements only. 
                          Actual performance may vary based on hardware capabilities, 
                          model architecture, and software optimizations. For training, 
                          consider techniques like QLoRA, gradient checkpointing, or distributed 
                          training to reduce memory usage.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">Submit the calculator form to see results</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 