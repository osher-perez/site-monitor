interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export const PricingCard = ({ title, price, features, isPopular }: PricingCardProps) => {
  return (
    <div className={`p-8 rounded-2xl border transition-all ${isPopular ? 'border-blue-500 shadow-xl scale-105 bg-white' : 'border-gray-200 bg-gray-50'}`}>
      {isPopular && <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block">הכי פופולרי</span>}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="text-4xl font-black mb-6">{price}<span className="text-sm font-normal text-gray-500">/לחודש</span></div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-green-500 font-bold">✓</span> {feature}
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-xl font-bold transition ${isPopular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
        בחר מסלול
      </button>
    </div>
  );
};