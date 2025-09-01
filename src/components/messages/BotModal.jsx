import React, { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { CheckIcon, XIcon, MinusIcon } from 'lucide-react';

const BotModal = ({ isOpen, setIsOpen }) => {
  
  const capabilities = [
    'Can answer questions regarding pay on past/upcoming shifts',
    'Can provide you information about your next shift',
    'Can assist you with how to get to your next shift',
    'Can share details about where to find more help',
    'Can help with basic troubleshooting',
    'Can respond by sounding out answers as well as text',
  ];

  const limitations = [
    "May occasionally provide inaccurate information",
    "Data is limited to the current month",
    "Limited to basic troubleshooting",
    "Responses may vary in quality"
  ];

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
        {/* Background */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        {/* Modal panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all space-y-6 relative">
              <XIcon 
                onClick={() => setIsOpen(false)} 
                className="absolute top-3 right-3 w-6 h-6 text-gray-400 hover:text-black cursor-pointer transition-colors" 
              />
              
              {/* Modal title */}
              <div className="space-y-1">
                <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  PayPulse Assistant
                </DialogTitle>
                <p className="text-sm text-gray-500">AI-powered support for your account</p>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-scroll">
                <hr className="border-gray-200" />
                
                {/* Beta Notice */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-800">Beta Version</p>
                  <div className="text-sm text-gray-700">
                      <p className="text-xs text-gray-500 mb-1">Current Status</p>
                      <p>This assistant is currently in beta testing. While helpful, it may occasionally make mistakes or provide incomplete information.</p>
                      <p className='mt-1'>These conversations are not stored. Once you leave this page, the conversation will reset.</p>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* What it can help with */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-800">What I Can Help With</p>
                  <div className="space-y-2">
                    {capabilities.map((capability, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700">
                        <CheckIcon className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                        <p>{capability}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Limitations */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-800">Current Limitations</p>
                  <div className="space-y-2">
                    {limitations.map((limitation, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700">
                        <MinusIcon className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0" />
                        <p>{limitation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Future Plans */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-800">Coming Soon</p>
                  <div className="grid grid-cols-1 gap-3 text-sm text-gray-700">
                    <div className="flex items-center">
                      <CheckIcon className="w-9 h-9 p-2 bg-purple-100 text-purple-600 rounded-md" />
                      <div className="ml-3">
                        <p className="text-xs text-gray-500">AI Upgrade</p>
                        <p>Enhanced ChatGPT-powered responses</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <CheckIcon className="w-9 h-9 p-2 bg-blue-100 text-blue-600 rounded-md" />
                      <div className="ml-3">
                        <p className="text-xs text-gray-500">Smarter Processing</p>
                        <p>Improved accuracy and understanding</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <CheckIcon className="w-9 h-9 p-2 bg-green-100 text-green-600 rounded-md" />
                      <div className="ml-3">
                        <p className="text-xs text-gray-500">Advanced Features</p>
                        <p>More detailed responses and capabilities</p>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Support Contact */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-800">Need Help?</p>
                  <div className="flex items-start text-sm text-gray-700">
                    <CheckIcon className="w-12 h-9 p-2 bg-indigo-100 text-indigo-600 rounded-md mt-1" />
                    <div className="ml-5">
                      <p className="text-xs text-gray-500 mb-1">Get in Touch</p>
                      <p className="mb-2">For complex issues or feedback about the assistant, our support team is here to help.</p>
                      <button 
                        onClick={() => {
                          window.open('mailto:support@paypulse.com', '_blank');
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium underline"
                      >
                        Contact Support →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Usage Tips */}
                <hr className="border-gray-200" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-800">Tips for Best Results</p>
                  <div className="flex items-start text-sm text-gray-700">
                    <CheckIcon className="w-9 h-9 p-2 bg-cyan-100 text-cyan-600 rounded-md mt-1" />
                    <div className="ml-3">
                      <p className="text-xs text-gray-500 mb-1">How to Ask</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Be specific with your questions</li>
                        <li>Ask one question at a time</li>
                        <li>Mention relevant dates or amounts</li>
                        <li>Double-check important information</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default BotModal;
