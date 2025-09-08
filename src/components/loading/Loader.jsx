import { useState, useEffect } from "react";
import Logo from '../assets/newlogo.png'

const Loader = () => {
    const [progress, setProgress] = useState(0);
    const [currentText, setCurrentText] = useState("Initializing...");

    const loadingSteps = [
        { text: "Initializing...", duration: 800 },
        { text: "Connecting to PayPulse...", duration: 1200 },
        { text: "Loading your dashboard...", duration: 1000 },
        { text: "Almost ready...", duration: 800 }
    ];

    useEffect(() => {
        let stepIndex = 0;
        let progressInterval;
        let textTimeout;

        const updateProgress = () => {
            progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressInterval);
                        return 100;
                    }
                    return prev + 1;
                });
            }, 30);
        };

        const updateText = () => {
            if (stepIndex < loadingSteps.length) {
                setCurrentText(loadingSteps[stepIndex].text);
                textTimeout = setTimeout(() => {
                    stepIndex++;
                    updateText();
                }, loadingSteps[stepIndex]?.duration || 1000);
            }
        };

        updateProgress();
        updateText();

        return () => {
            clearInterval(progressInterval);
            clearTimeout(textTimeout);
        };
    }, []);

    return (
        <div className="flex flex-col justify-center items-center h-full bg-gradient-to-br p-8">
            <div className="w-full max-w-md space-y-8">
                {/* Logo/Brand Area */}
                <img className="h-11 flex mx-auto" src={Logo} />

                {/* Progress Section */}
                <div className="space-y-6">
                    {/* Progress Bar */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-600">
                                {currentText}
                            </span>
                            <span className="text-sm font-medium text-slate-500">
                                {progress}%
                            </span>
                        </div>
                        
                        <div className="relative">
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out relative"
                                    style={{ width: `${progress}%` }}
                                >
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Animated dots */}
                    <div className="flex justify-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="text-center">
                    <p className="text-xs text-slate-400">
                        Loading your data...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Loader;