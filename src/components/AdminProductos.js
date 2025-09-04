import { useEffect, useState } from "react";
import API from "../api";
import "../../src/assets/css/admin.css";
import Carousel from "./Carousel";

const BACKEND_URL = "https://tiendaclient.onrender.com";

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    imagenes: [], // array para nuevas imágenes
    tipo: ""
  });
  const [editando, setEditando] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const resProductos = await API.get("/productos");
      const resTipos = await API.get("/tipos");
      setProductos(resProductos.data);
      setTipos(resTipos.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("descripcion", form.descripcion);
      formData.append("precio", form.precio);
      formData.append("tipo", form.tipo);

      if (form.imagenes && form.imagenes.length > 0) {
        for (let i = 0; i < form.imagenes.length; i++) {
          formData.append("imagenes", form.imagenes[i]);
        }
      }

      if (editando) {
        await API.put(`/productos/${editando}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("Producto actualizado ✅");
      } else {
        await API.post("/productos", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMsg("Producto agregado ✅");
      }

      setForm({ nombre: "", descripcion: "", precio: 0, imagenes: [], tipo: "" });
      setEditando(null);
      cargarDatos();
    } catch (err) {
      console.error(err);
      setMsg("Error al guardar producto ❌");
    }
  };

  const editarProducto = (producto) => {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      imagenes: producto.imagenes || [],
      tipo: producto.tipo?._id || ""
    });
    setEditando(producto._id);
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await API.delete(`/productos/${id}`);
      setMsg("Producto eliminado ✅");
      cargarDatos();
    } catch (err) {
      console.error(err);
      setMsg("Error al eliminar producto ❌");
    }
  };

  return (
    <div className="admin-container">
      <h2>Gestión de Productos</h2>

      <div className="form-preview-container">
        <form className="admin-form" onSubmit={guardarProducto}>
          <input
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Precio"
            value={form.precio}
            onChange={(e) => setForm({ ...form, precio: e.target.value })}
            required
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setForm({ ...form, imagenes: Array.from(e.target.files) })}
          />

          <select
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            required
          >
            <option value="">Selecciona un tipo</option>
            {tipos.map((t) => (
              <option key={t._id} value={t._id}>{t.nombre}</option>
            ))}
          </select>
          <button type="submit">{editando ? "Actualizar" : "Agregar"} Producto</button>
        </form>

        {/* Vista previa del producto */}
        <div className="producto-card">
          {form.imagenes.length > 0 && (
            <Carousel
              imagenes={form.imagenes.map((img) =>
                img instanceof File ? URL.createObjectURL(img) : `${BACKEND_URL}${img}`
              )}
            />
          )}
          <div className="producto-info">
            <h3>{form.nombre || "Nombre del producto"}</h3>
            <p>{tipos.find((t) => t._id === form.tipo)?.nombre || "Categoría"}</p>
            <p className="producto-descripcion">{form.descripcion || "Descripción"}</p>
            <p className="producto-precio">₡{form.precio || "0"}</p>
          </div>
        </div>
      </div>

      {msg && <p style={{ marginTop: "10px", color: msg.includes("❌") ? "#d9534f" : "#28a745" }}>{msg}</p>}

      <hr />

      {/* Lista de productos */}
      <div className="productos-grid">
        {productos.map((p) => (
          <div key={p._id} className="producto-card">
            <Carousel
              imagenes={(p.imagenes || []).map(img => `${BACKEND_URL}${img}`)}
            />
            <div className="producto-info">
              <h3>{p.nombre}</h3>
              <p>{p.tipo?.nombre}</p>
              <p>{p.descripcion}</p>
              <p className="producto-precio">₡{p.precio}</p>
            </div>
            <div className="admin-actions">
              <button className="editar" onClick={() => editarProducto(p)}>Editar</button>
              <button className="eliminar" onClick={() => eliminarProducto(p._id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProductos;
