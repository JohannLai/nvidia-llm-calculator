# <img src="./public/favicon.svg" width="30" height="30" alt="NVIDIA LLM Calculator Logo" style="vertical-align: middle;"> NVIDIA LLM Calculator

A practical tool to help users calculate memory requirements for large language models and recommend suitable NVIDIA GPUs.

## 📝 Project Overview

The NVIDIA LLM Calculator is a tool designed for AI researchers, developers, and organizations to:

- Calculate memory requirements for language models of various sizes and configurations
- Distinguish between inference and training memory needs
- Get NVIDIA GPU recommendations based on calculation results
- Utilize quick selection of common LLM models

## ✨ Key Features

- **Memory Calculator**: Calculate LLM memory requirements based on model parameters, precision, batch size, etc.
- **GPU Recommendations**: Provides single GPU and multi-GPU configuration suggestions
- **Multilingual Support**: English and Chinese interfaces
- **Popular Model Templates**: Built-in parameters for Llama 3, Qwen2, Mixtral, Gemma2, and other popular models
- **Detailed Memory Analysis**: Provides detailed categorization of model size, KV cache, activation memory, etc.

## 🚀 Quick Start

```bash
# Clone the project
git clone https://github.com/your-username/nvidia-llm-calculator.git
cd nvidia-llm-calculator

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start using the calculator.

## 🔧 Tech Stack

- **Framework**: Next.js 15
- **UI Components**: Shadcn UI, Radix UI
- **State Management**: React Hook Form
- **Internationalization**: next-intl
- **Charts**: Chart.js, react-chartjs-2
- **Styling**: Tailwind CSS
- **Form Validation**: Zod

## 📊 How the Calculator Works

The calculator uses the following formulas to calculate LLM memory requirements:

- **Model Size** = Parameter Count × Precision (bytes)
- **KV Cache** = 2 × Batch Size × Sequence Length × Layers × Hidden Size × Precision (bytes)
- **Activation Memory** = Batch Size × Sequence Length × Hidden Size × Coefficient × 4
- **Optimizer States** = Trainable Parameters × 8 (AdamW with 2 states in FP32)
- **Gradients** = Trainable Parameters × 4 (stored in FP32)

## 🌐 Internationalization

The project supports multiple languages:

- English (default)
- Chinese

Languages can be switched using the language switcher in the top right corner of the page.

## 🎯 Use Cases

- Researchers calculating GPU configurations needed for training new LLMs
- Developers estimating resource requirements for fine-tuning existing models
- Organizations planning AI infrastructure needs
- Students and enthusiasts learning about memory impacts of different model architectures

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please check out the [contribution guidelines](CONTRIBUTING.md) for more information.

## 📧 Contact

For questions or suggestions, please contact us through [issues](https://github.com/your-username/nvidia-llm-calculator/issues).
