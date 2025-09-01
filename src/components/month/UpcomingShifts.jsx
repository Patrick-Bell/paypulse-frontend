import { Clock4, MapPin, CheckCircle , Calendar, X } from "lucide-react"

const UpcomingShifts = ({ shifts }) => {

  const formatDate = (date) => {
    const options = { month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

const formatTime = (time) => {
    return new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const getMaps = (location) => {
  window.open(`https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${location}`, '_blank')
}

    return (

        <>

    <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock4 className="w-5 h-5 mr-2 text-blue-600" />
            Upcoming Shifts ({shifts.length})
          </h3>
          {shifts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-70 text-center text-gray-500">
            <Clock4 className="w-6 h-6 mb-2 text-gray-400" />
            <p className="text-sm font-medium">No upcoming shifts.</p>
          </div>
          ):(
            <div className="space-y-3 max-h-80 overflow-y-auto">
            {shifts
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((shift, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{formatDate(shift.date)}</p>
                    <p className="text-sm text-gray-600">{formatTime(shift.start_time)} - {formatTime(shift.finish_time)}</p>
                    <p onClick={() => getMaps(shift?.location)} className="text-xs text-gray-500 flex items-center hover:text-black cursor-pointer">
                      <MapPin className="w-3 h-3 mr-1" />
                      {shift.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                {shift.status === 'confirmed' ? (
                    <span className="flex items-center text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Confirmed
                    </span>
                  ) : shift.status === 'pending' ? (
                    <span className="flex items-center text-orange-600 text-sm">
                      <Clock4 className="w-4 h-4 mr-1" />
                      Pending
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600 text-sm">
                      <X className="w-4 h-4 mr-1" />
                      Cancelled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          )}
         
        </div>
        
        </>
    )
}

export default UpcomingShifts