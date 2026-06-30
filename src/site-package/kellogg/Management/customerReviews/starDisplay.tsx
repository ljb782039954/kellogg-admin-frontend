
import {
    Star, 
} from 'lucide-react';


// ---- Star renderer (read-only) ----
export default function StarDisplay({ rating }: { rating: number }) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        const diff = rating - (i - 1);
        if (diff >= 1) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />);
        } else if (diff >= 0.5) {
        // Half star using clip trick
        stars.push(
            <span key={i} className="relative w-3.5 h-3.5 inline-block">
            <Star className="w-3.5 h-3.5 fill-gray-200 text-gray-200 absolute" />
            <span className="absolute inset-0 overflow-hidden w-[50%]">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            </span>
            </span>
        );
        } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-gray-200 text-gray-200" />);
        }
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
    }
