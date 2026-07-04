import type { Translation } from '@/cms/types';

interface BilingualInputAeraProps {
    label?: string;
    value: Translation;
    onChange: (value: Translation) => void;
    placeholder?: { zh?: string; en?: string };
}

export default function BilingualInputAera({
    label,
    value,
    onChange,
    placeholder = {},
}: BilingualInputAeraProps) {
    const InputComponent = 'textarea';

    return (
        <div className="space-y-3">
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3"> */}
            <div className="flex flex-col gap-3">
                {/* Chinese Input */}
                <div className="relative">
                    <span className="absolute left-3 top-3 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        中文
                    </span>
                    <InputComponent
                        value={value.zh}
                        onChange={(e) => onChange({ ...value, zh: e.target.value })}
                        placeholder={placeholder.zh}
                        className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                        rows={3}
                    />
                </div>
                {/* English Input */}
                <div className="relative">
                    <span className="absolute left-3 top-3 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        EN
                    </span>
                    <InputComponent
                        value={value.en}
                        onChange={(e) => onChange({ ...value, en: e.target.value })}
                        placeholder={placeholder.en}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                        rows={3}
                    />
                </div>
            </div>
        </div>
    );
}