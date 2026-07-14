import type { TableContent } from "../../components/blocks";

const table: TableContent = {
  title: { zh: "尺码与尺寸", en: "Sizing & Measurements" },
  subtitle: { zh: "单位：厘米", en: "Measurements in centimeters" },
  columns: [
    { id: "size", label: { zh: "尺码", en: "Size" } },
    { id: "bust", label: { zh: "胸围", en: "Bust" } },
    { id: "waist", label: { zh: "腰围", en: "Waist" } },
  ],
  rows: [
    {
      id: "s",
      cells: {
        size: { zh: "S", en: "S" },
        bust: { zh: "82 cm", en: "82 cm" },
        waist: { zh: "64 cm", en: "64 cm" },
      },
    },
    {
      id: "m",
      cells: {
        size: { zh: "M", en: "M" },
        bust: { zh: "86 cm", en: "86 cm" },
        waist: { zh: "68 cm", en: "68 cm" },
      },
    },
    {
      id: "l",
      cells: {
        size: { zh: "L", en: "L" },
        bust: { zh: "90 cm", en: "90 cm" },
        waist: { zh: "72 cm", en: "72 cm" },
      },
    },
  ],
  showHeader: true,
  striped: false,
  textAlign: "center",
};

export default table;
