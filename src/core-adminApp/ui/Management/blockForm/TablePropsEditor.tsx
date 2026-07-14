import { useState } from "react";
import type { Translation } from "@/cms/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BilingualInput from "@/core-adminApp/ui/Input/BilingualInput";
import { Plus, Trash2 } from "lucide-react";

const MAX_COLUMNS = 6;
const MAX_ROWS = 20;
const emptyTranslation = (): Translation => ({ zh: "", en: "" });
const createId = (prefix: string) => `${prefix}_${crypto.randomUUID()}`;

export interface TableEditorContent {
  title?: Translation;
  subtitle?: Translation;
  columns: Array<{ id: string; label: Translation }>;
  rows: Array<{ id: string; cells: Record<string, Translation> }>;
  showHeader?: boolean;
  striped?: boolean;
  textAlign?: "left" | "center";
}

export interface TablePropsEditorProps<T extends TableEditorContent> {
  props: T;
  onUpdate: (props: T) => void;
}

export function TablePropsEditor<T extends TableEditorContent>({ props, onUpdate }: TablePropsEditorProps<T>) {
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const text = (value?: Translation) => value?.[language] || "";
  const update = (nextProps: TableEditorContent) => onUpdate(nextProps as T);
  const updateTranslation = (value: Translation | undefined, nextText: string): Translation => ({
    ...(value || emptyTranslation()),
    [language]: nextText,
  });

  const updateColumn = (columnId: string, label: string) => {
    update({
      ...props,
      columns: props.columns.map((column) => (
        column.id === columnId ? { ...column, label: updateTranslation(column.label, label) } : column
      )),
    });
  };

  const updateCell = (rowId: string, columnId: string, value: string) => {
    update({
      ...props,
      rows: props.rows.map((row) => (
        row.id === rowId
          ? { ...row, cells: { ...row.cells, [columnId]: updateTranslation(row.cells[columnId], value) } }
          : row
      )),
    });
  };

  const addColumn = () => {
    if (props.columns.length >= MAX_COLUMNS) return;
    const id = createId("column");
    update({
      ...props,
      columns: [...props.columns, { id, label: emptyTranslation() }],
      rows: props.rows.map((row) => ({ ...row, cells: { ...row.cells, [id]: emptyTranslation() } })),
    });
  };

  const removeColumn = (columnId: string) => {
    if (props.columns.length <= 1) return;
    update({
      ...props,
      columns: props.columns.filter((column) => column.id !== columnId),
      rows: props.rows.map(({ cells, ...row }) => {
        const { [columnId]: _removedCell, ...nextCells } = cells;
        return { ...row, cells: nextCells };
      }),
    });
  };

  const addRow = () => {
    if (props.rows.length >= MAX_ROWS) return;
    onUpdate({
      ...props,
      rows: [...props.rows, {
        id: createId("row"),
        cells: Object.fromEntries(props.columns.map((column) => [column.id, emptyTranslation()])),
      }],
    });
  };

  const removeRow = (rowId: string) => {
    if (props.rows.length <= 1) return;
    update({ ...props, rows: props.rows.filter((row) => row.id !== rowId) });
  };

  return (
    <div className="space-y-6">
      <BilingualInput
        label="表格标题"
        value={props.title || emptyTranslation()}
        onChange={(title) => update({ ...props, title })}
        placeholder={{ zh: "例如：尺码参考", en: "For example: Size Guide" }}
      />
      <BilingualInput
        label="副标题"
        value={props.subtitle || emptyTranslation()}
        onChange={(subtitle) => update({ ...props, subtitle })}
        placeholder={{ zh: "例如：单位：厘米", en: "For example: Measurements in centimeters" }}
      />

      <div className="flex flex-wrap gap-6 rounded-lg border bg-gray-50 p-4">
        <Label className="flex items-center gap-3">
          <Switch
            checked={props.showHeader !== false}
            onCheckedChange={(showHeader) => update({ ...props, showHeader })}
          />
          显示表头
        </Label>
        <Label className="flex items-center gap-3">
          <Switch
            checked={props.striped === true}
            onCheckedChange={(striped) => update({ ...props, striped })}
          />
          斑马纹
        </Label>
        <Label className="flex items-center gap-3">
          <Switch
            checked={props.textAlign === "center"}
            onCheckedChange={(isCentered) => update({ ...props, textAlign: isCentered ? "center" : "left" })}
          />
          文本居中
        </Label>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700">表格内容</h4>
            <p className="text-xs text-gray-500">最多 {MAX_COLUMNS} 列、{MAX_ROWS} 行；切换语言后分别编辑中英文内容。</p>
          </div>
          <Tabs value={language} onValueChange={(value) => setLanguage(value as "zh" | "en")}>
            <TabsList>
              <TabsTrigger value="zh">中文</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-14 border-b px-2 py-3 text-left text-xs font-medium text-gray-500">行</th>
                {props.columns.map((column, index) => (
                  <th key={column.id} className="min-w-44 border-b border-l px-2 py-2 align-top">
                    <div className="flex gap-1">
                      <input
                        value={text(column.label)}
                        onChange={(event) => updateColumn(column.id, event.target.value)}
                        placeholder={`列 ${index + 1}`}
                        aria-label={`第 ${index + 1} 列表头`}
                        className="min-w-0 flex-1 rounded border bg-white px-2 py-1.5 font-medium outline-none focus:border-primary"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        disabled={props.columns.length <= 1}
                        onClick={() => removeColumn(column.id)}
                        aria-label={`删除第 ${index + 1} 列`}
                      >
                        <Trash2 className="size-4 text-red-500" />
                      </Button>
                    </div>
                  </th>
                ))}
                <th className="border-b border-l px-2 py-2">
                  <Button type="button" variant="outline" size="sm" onClick={addColumn} disabled={props.columns.length >= MAX_COLUMNS}>
                    <Plus className="mr-1 size-4" />添加列
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {props.rows.map((row, rowIndex) => (
                <tr key={row.id}>
                  <td className="border-b px-2 py-2 text-center text-xs text-gray-500">{rowIndex + 1}</td>
                  {props.columns.map((column) => (
                    <td key={column.id} className="border-b border-l p-2">
                      <input
                        value={text(row.cells[column.id])}
                        onChange={(event) => updateCell(row.id, column.id, event.target.value)}
                        aria-label={`第 ${rowIndex + 1} 行 ${text(column.label) || "未命名列"}`}
                        className="w-full rounded border bg-white px-2 py-1.5 outline-none focus:border-primary"
                      />
                    </td>
                  ))}
                  <td className="border-b border-l px-2 py-2 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={props.rows.length <= 1}
                      onClick={() => removeRow(row.id)}
                      aria-label={`删除第 ${rowIndex + 1} 行`}
                    >
                      <Trash2 className="size-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button type="button" variant="outline" size="sm" onClick={addRow} disabled={props.rows.length >= MAX_ROWS}>
          <Plus className="mr-1 size-4" />添加行
        </Button>
      </div>
    </div>
  );
}
