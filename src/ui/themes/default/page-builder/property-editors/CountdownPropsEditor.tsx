// 倒计时促销组件属性编辑器

import { Label } from '@/ui/primitives/label';
import { Input } from '@/ui/primitives/input';
import BilingualInput from '@/ui/forms/BilingualInput';
import type { CountdownProps } from '@/components/blocks/Countdown';

export interface CountdownPropsEditorProps {
  props: CountdownProps;
  onUpdate: (props: CountdownProps) => void;
}


export function CountdownPropsEditor({ props, onUpdate }: CountdownPropsEditorProps) {
  return (
    <div className="space-y-6">
      {/* 文本内容 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">文本内容</h4>
        <BilingualInput
          label="标题"
          value={props.title || { zh: '', en: '' }}
          onChange={(val) => onUpdate({ ...props, title: val })}
        />
        <BilingualInput
          label="副标题"
          value={props.subtitle || { zh: '', en: '' }}
          onChange={(val) => onUpdate({ ...props, subtitle: val })}
        />
      </div>

      {/* 倒计时设置 */}
      <div className="space-y-3 pb-4 border-b">
        <h4 className="font-medium text-sm text-gray-700">倒计时设置</h4>
        <div className="space-y-2">
          <Label>结束时间</Label>
          <Input
            type="datetime-local"
            value={props.values?.endTime || ''}
            onChange={(e) => onUpdate({ ...props, values: { ...props.values, endTime: e.target.value } })}
          />
          <p className="text-xs text-gray-500">设置活动结束的日期和时间</p>
        </div>
      </div>

    </div>
  );
}
