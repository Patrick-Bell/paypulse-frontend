import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock4, MapPin, Star } from 'lucide-react';

const CompletedShifts = ({ shifts }) => {

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

        <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
          Completed Shifts ({shifts.length})
        </h3>
        {shifts.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-70 text-center text-gray-500">
           <Clock4 className="w-6 h-6 mb-2 text-gray-400" />
           <p className="text-sm font-medium">No shifts completed.</p>
         </div>
        ):(
          <div className="space-y-3 max-h-80 overflow-y-auto">
          {shifts
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((shift, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
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
              <div className="text-right">
                <p className="font-bold text-green-600">{shift.earnings}</p>
                <p className="text-xs text-gray-600 flex items-center">
                  <Star className="w-3 h-3 mr-1 text-orange-400" />
                  {shift.rating}
                </p>
              </div>
            </div>
          ))}
        </div>
        )}
      
      </div>

    )
}

export default CompletedShifts