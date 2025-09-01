import { ArrowRight, Zap, Shield, BarChart3, Crown, Briefcase, Bot, Calendar } from "lucide-react"
import { createPayment } from "../routes/PaymentRoutes"
import StaggerAppear from "../animations/StaggerAppear"
import { useAuth } from "../context/AuthContext"

const PayPulsePro = () => {
  const { user } = useAuth()

  const upgrade = async () => {
    const response = await createPayment()

    if (response){
      window.location.href = response.url
    }
  }

  const features = [
    { id: 1, icon: <Zap className="w-4 h-4 mr-2 text-yellow-300" />, text: "Advanced Analytics Dashboard" },
    { id: 2, icon: <Briefcase className="w-4 h-4 mr-2 text-yellow-300" />, text: "Log Unlimited Shifts" },
    { id: 3, icon: <Bot className="w-4 h-4 mr-2 text-yellow-300" />, text: "Access to PayPulse Bot" },
    { id: 4, icon: <Calendar className="w-4 h-4 mr-2 text-yellow-300" />, text: "Calendar Integration" }
  ]

    return (

        <>
        
        <div className={`border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-indigo-500 to-purple-600`}>
            <div>
      {/* Background decoration */}
      
      <div className="relative z-10">
        <div className="flex items-center mb-3">
          <Crown className="w-6 h-6 text-yellow-300 mr-2" />
          <span className="bg-yellow-300 text-indigo-900 px-2 py-1 rounded-full text-xs font-bold">
            PRO
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-white">Upgrade to PayPulse Pro</h3>
        <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
          Unlock additional pro features to improve your PayPulse experience, allowing you to dig further into your shift earnings and patterns.
        </p>
        
        <div className="space-y-2 mb-4">
          {features.map((feature, i) => (
            <StaggerAppear index={i}>
            <div key={feature.id} className="flex items-center text-white">
              {feature.icon}
              <span className="text-sm">{feature.text}</span>
            </div>
            </StaggerAppear>
          ))}
        </div>
        
        <button 
          className="w-full bg-white text-indigo-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center group cursor-pointer"
          onClick={() => upgrade()}
        >
          <span>Upgrade Now</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
        
        <div className="flex items-center align-middle justify-center">
        <p className="text-center text-xs text-indigo-200 mt-2">
          £1.49 
        </p>
        <div className="w-1 h-1 rounded-full bg-gray-300 items-center flex flex-col justify-center mt-2 ml-2"></div>
        <p className="text-center text-xs text-indigo-200 mt-2 ml-2">One Time Purchase</p>
        </div>
      </div>
    </div>
    </div>
            
            </>
    )
}

export default PayPulsePro