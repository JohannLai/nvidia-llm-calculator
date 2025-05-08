export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-7 w-7 relative">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                  <rect width="36" height="36" rx="4" fill="#76B900" />
                  <path d="M7 7H29V29H7V7Z" fill="#76B900" />
                  <path d="M29 7H7V29H29V7ZM27 9V27H9V9H27Z" fill="white" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">
                NVIDIA <span className="text-green-500">LLM Tools</span>
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Advanced GPU calculator for LLM inference and training. 
              Optimize your hardware configuration for the next breakthrough in AI.
            </p>
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} NVIDIA LLM Calculator - Not an official NVIDIA product
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-medium mb-4 border-b border-green-500 pb-2 inline-block">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://docs.nvidia.com/deeplearning/frameworks/index.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-500 transition-colors"
                >
                  Deep Learning Docs
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/NVIDIA/TensorRT-LLM" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-500 transition-colors"
                >
                  TensorRT-LLM
                </a>
              </li>
            </ul>
          </div>
          
          {/* Products */}
          <div>
            <h3 className="text-white font-medium mb-4 border-b border-green-500 pb-2 inline-block">NVIDIA AI</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.nvidia.com/en-us/data-center/products/ai-computing/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-500 transition-colors"
                >
                  AI Computing
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nvidia.com/en-us/data-center/dgx-systems/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-500 transition-colors"
                >
                  NVIDIA DGX
                </a>
              </li>
              <li>
                <a 
                  href="https://www.nvidia.com/en-us/data-center/hgx/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-500 transition-colors"
                >
                  NVIDIA HGX
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section with Line */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <a 
              href="https://github.com/johannlai/nvidia-llm-calculator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-500 transition-colors flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              <span>GitHub</span>
            </a>
          </div>
          <div>
            <p className="text-gray-500 text-sm">
              Designed with ♥ for NVIDIA GPUs and LLM enthusiasts
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 