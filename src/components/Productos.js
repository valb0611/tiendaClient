import { useEffect, useState } from "react";
import "../../src/assets/css/catalog.css";
import Carousel from "./Carousel";
import API from "../api"; // ✅ usar la instancia de axios

function Productos({ filtroTipo, filtroNombre }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarProductos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get("/productos");
        let filtrados = res.data;

        if (filtroTipo) {
          filtrados = filtrados.filter(
            (p) => p.tipo?.nombre?.toLowerCase() === filtroTipo.toLowerCase()
          );
        }
        if (filtroNombre) {
          filtrados = filtrados.filter((p) =>
            p.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
          );
        }

        setProductos(filtrados);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, [filtroTipo, filtroNombre]);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;
  if (productos.length === 0) return <p>No hay productos para mostrar.</p>;

  return (
    <div className="productos-grid">
      {productos.map((producto) => (
        <div key={producto._id} className="producto-card">
          <Carousel imagenes={producto.imagenes || []} />
          <div className="producto-info">
            <h3>{producto.nombre}</h3>
            <p>{producto.tipo?.nombre}</p>
            <p>{producto.descripcion}</p>
            <p className="producto-precio">₡{producto.precio}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Productos;
