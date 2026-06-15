import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RecommendationCard = ({ rec }) => {
  const [showVariants, setShowVariants] = useState(false);
  // Support both clustered format (brand, model directly on rec) or old format (rec.car) just in case
  const isClustered = !!rec.variants;
  const brand = isClustered ? rec.brand : rec.car.brand;
  const model = isClustered ? rec.model : rec.car.model;
  const imageUrl = isClustered ? rec.image_url : rec.car.image_url;
  const startingPrice = isClustered ? rec.startingPrice : rec.car.price_in_lakhs;
  const fuelOptions = isClustered ? rec.fuelOptions : [rec.car.fuel_type];
  const transOptions = isClustered ? rec.transmissionOptions : [rec.car.transmission];
  const variants = isClustered ? rec.variants : [rec.car];

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-3 w-full">
      <div className="h-32 bg-gray-100 relative">
        {imageUrl ? (
          <img src={imageUrl} alt={`${brand} ${model}`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
        )}
        
        {/* Match Badge */}
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-green-700 shadow-sm border border-green-100 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
          {rec.matchPercentage}% Match
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-50">
        <h4 className="font-bold text-gray-900 leading-tight text-base mb-1 truncate">
          {brand} {model}
        </h4>
        <p className="font-black text-indigo-600 text-sm mb-2">Starts at ₹{startingPrice} Lakh</p>
        
        <div className="flex flex-wrap gap-1.5 mb-3">
          {fuelOptions.map((f, i) => (
             <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-semibold">{f}</span>
          ))}
          {transOptions.map((t, i) => (
             <span key={`t-${i}`} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-semibold">{t}</span>
          ))}
        </div>
        
        {isClustered && variants.length > 0 && (
          <button 
            onClick={() => setShowVariants(!showVariants)}
            className="flex items-center justify-between w-full text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 py-1.5 px-3 rounded-lg transition-colors mb-2"
          >
            <span>View Variants ({variants.length})</span>
            <svg className={`w-4 h-4 transform transition-transform ${showVariants ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
        )}

        {showVariants && isClustered && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 mb-2 max-h-40 overflow-y-auto">
            {variants.map((v, idx) => (
              <div key={idx} className="flex items-center justify-between py-1.5 border-b border-gray-200 last:border-0">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800">{v.variant}</span>
                  <span className="text-[10px] text-gray-500">{v.fuel_type} • {v.transmission} • {v.condition}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-indigo-600">₹{v.price_in_lakhs}L</span>
                  <Link to={`/cars/${v._id}`} className="text-[10px] text-blue-600 hover:underline">Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons for non-clustered or fallback */}
        {!isClustered && (
          <Link 
            to={`/cars/${rec.car._id}`} 
            className="block w-full text-center py-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
