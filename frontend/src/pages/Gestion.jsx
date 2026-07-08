import { useNavigate } from 'react-router-dom'

const accesosGestion = [
  {
    title: 'CRUD para Viviendas',
    text: 'Administrar viviendas, su estado operativo y la planificación logística asociada.',
    to: '/gestionar-viviendas',
  },
  {
    title: 'CRUD para Usuarios',
    text: 'Revisar usuarios, roles y permisos desde el panel centralizado.',
    to: '/gestionar-personal',
  },
  {
    title: 'CRUD para Cuadrillas',
    text: 'Crear, editar y eliminar cuadrillas desde una vista específica de administración.',
    to: '/gestionar-cuadrillas',
  },
]

function Gestion() {
  const navigate = useNavigate()

  return (
    <section className="page-card">
      <h1>Gestión</h1>
      <p className="subtitle">Panel exclusivo para administradores con accesos directos a los mantenedores principales.</p>

      <div className="cards-grid">
        {accesosGestion.map((item) => (
          <article key={item.to} className="card">
            <h2>{item.title}</h2>
            <p>{item.text}</p>
            <button type="button" className="btn-primary" onClick={() => navigate(item.to)}>
              Abrir
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Gestion
