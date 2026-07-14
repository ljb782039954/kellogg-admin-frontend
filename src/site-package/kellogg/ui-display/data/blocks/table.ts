import type { TableContent } from "../../components/blocks";

const tableProps: TableContent = {
  title: { zh: "尺码参考", en: "Size Guide" },
  subtitle: { zh: "单位：厘米", en: "Measurements in centimeters" },
  columns: [
    { id: "size", label: { zh: "尺码", en: "Size" } },
    { id: "chest", label: { zh: "胸围", en: "Chest" } },
    { id: "length", label: { zh: "衣长", en: "Length" } },
  ],
  rows: [
    {
      id: "s",
      cells: {
        size: { zh: "S", en: "S" },
        chest: { zh: "96 cm", en: "96 cm" },
        length: { zh: "68 cm", en: "68 cm" },
      },
    },
    {
      id: "m",
      cells: {
        size: { zh: "M", en: "M" },
        chest: { zh: "100 cm", en: "100 cm" },
        length: { zh: "70 cm", en: "70 cm" },
      },
    },
    {
      id: "l",
      cells: {
        size: { zh: "L", en: "L" },
        chest: { zh: "104 cm", en: "104 cm" },
        length: { zh: "72 cm", en: "72 cm" },
      },
    },
  ],
  showHeader: true,
  striped: false,
  textAlign: "left",
};

export default tableProps;
