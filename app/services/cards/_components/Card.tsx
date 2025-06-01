export function Card({
  name,
  cardNumber,
  cardType,
}: {
  name: string;
  cardNumber: string;
  cardType: string;
}) {
  const isPhysical = cardType === "physical";
  const gradientClass = isPhysical
    ? "bg-gradient-to-r from-blue-600 to-blue-800"
    : "bg-gradient-to-r from-gray-400 to-gray-600 opacity-75";

  return (
    <div className={`
      w-full lg:w-xs h-40 ${gradientClass} rounded-xl p-4 text-white relative
      transform transition-all duration-300 ease-in-out
      hover:scale-105 hover:shadow-2xl hover:shadow-black/20
      cursor-pointer
      animate-fade-in
      group
    `}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                      opacity-0 group-hover:opacity-100 group-hover:animate-shine rounded-xl transition-opacity duration-300" />

      <div className="absolute top-4 left-4 transform transition-transform duration-300 group-hover:translate-y-[-2px]">
        <div className="text-lg font-bold">Byte</div>
        <div className="text-sm">Platinum</div>
      </div>
      <div className="absolute bottom-4 left-4 transform transition-transform duration-300 group-hover:translate-y-[2px]">
        <div className="text-sm">{name}</div>
        <div className="text-sm font-mono tracking-wider">{cardNumber}</div>
      </div>

      <div className="absolute top-2 right-2 w-8 h-8 border-2 border-white/30 rounded-full
                      transform transition-all duration-500 group-hover:rotate-180 group-hover:scale-110" />
    </div>
  );
}