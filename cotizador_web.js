import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CotizadorVentanas() {
  const [ancho, setAncho] = useState(0);
  const [alto, setAlto] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [precio, setPrecio] = useState(null);
  const [costosMateriales, setCostosMateriales] = useState([]);

  // URL del archivo de Google Sheets en formato JSON
  const googleSheetURL = "https://docs.google.com/spreadsheets/d/10sUhrFTUKdPHzKu_Ge0ivZQyxatHeAQC/gviz/tq?tqx=out:json";

  useEffect(() => {
    fetch(googleSheetURL)
      .then((res) => res.text())
      .then((data) => {
        const jsonData = JSON.parse(data.substr(47).slice(0, -2));
        const rows = jsonData.table.rows.map((row) => {
          return {
            material: row.c[0]?.v || "", // Nombre del material
            costoPorMetro: parseFloat(row.c[1]?.v) || 0, // Costo por metro
          };
        });
        setCostosMateriales(rows);
      })
      .catch((err) => console.error("Error al obtener los datos de Google Sheets:", err));
  }, []);

  const calcularPrecio = () => {
    const areaM2 = (ancho / 100) * (alto / 100);
    let costoMateriales = 0;

    costosMateriales.forEach((mat) => {
      costoMateriales += areaM2 * mat.costoPorMetro;
    });

    const total = costoMateriales * cantidad;
    setPrecio(total.toFixed(2));
  };

  const compartirEnWhatsApp = () => {
    if (precio !== null) {
      const mensaje = `Hola, estoy interesado en una cotización de ventanas. Detalles:\n- Ancho: ${ancho} cm\n- Alto: ${alto} cm\n- Cantidad: ${cantidad}\n- Precio estimado: $${precio} MXN`;
      const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Cotizador de Ventanas</h2>
          <Input
            type="number"
            placeholder="Ancho en cm"
            value={ancho}
            onChange={(e) => setAncho(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Alto en cm"
            value={alto}
            onChange={(e) => setAlto(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
          <Button onClick={calcularPrecio}>Calcular Cotización</Button>
          {precio !== null && (
            <div className="text-lg font-semibold mt-2">
              Precio estimado: ${precio} MXN
            </div>
          )}
          {precio !== null && (
            <Button onClick={compartirEnWhatsApp} className="mt-2">Compartir en WhatsApp</Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
