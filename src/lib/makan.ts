export interface MakanPreset {
  name: string;
  price: number;
}

/** Common mamak / kopitiam items with typical RM prices — quick-add for the
 *  by-item split. Real local vocabulary, not just decoration. */
export const MAKAN_PRESETS: MakanPreset[] = [
  { name: "Roti Canai", price: 1.5 },
  { name: "Roti Telur", price: 2.5 },
  { name: "Teh Tarik", price: 2.5 },
  { name: "Kopi O", price: 2.0 },
  { name: "Milo Ais", price: 3.0 },
  { name: "Nasi Lemak", price: 3.5 },
  { name: "Maggi Goreng", price: 6.0 },
  { name: "Mee Goreng", price: 7.0 },
  { name: "Nasi Goreng", price: 8.0 },
  { name: "Murtabak", price: 9.0 },
  { name: "Teh O Ais", price: 2.0 },
  { name: "Roti Bom", price: 3.0 },
];
