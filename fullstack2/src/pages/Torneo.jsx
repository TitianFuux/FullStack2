import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TORNEOS, JUEGOS, Datos } from '../data/datos';

export default function Torneos() {
  const [busqueda, setBusqueda] = useState('');
  const [juegoId, setJuegoId] = useState('');
  const [estado, setEstado] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const handleLimpiar = () => {
    setBusqueda('');
    setJuegoId('');
    setEstado('');
    setDesde('');
    setHasta('');
  };

  const validarYFiltrar = () => {
    if (desde && hasta && desde > hasta) {
      return { error: 'La fecha inicial no puede ser posterior a la fecha final.', resultados: [] };
    }

    const filtrados = TORNEOS.filter((t) => {
      const coincideNombre = t.nombre.toLowerCase().includes(busqueda.trim().toLowerCase());
      const coincideJuego = !juegoId || juegoId === 'todos' || t.juegoId === juegoId;
      const coincideEstado = !estado || estado === 'todos' || t.estado === estado;
      const coincideDesde = !desde || t.fechaInicio >= desde;
      const coincideHasta = !hasta || t.fechaInicio <= hasta;
      return coincideNombre && coincideJuego && coincideEstado && coincideDesde && coincideHasta;
    });

    return { error: '', resultados: filtrados };
  };

  const { error, resultados } = validarYFiltrar();

  return (
    <main id="contenido-principal">
      <section className="franja">
        <div className="contenedor">
          <h1>Todos los torneos</h1>
          <p>Filtra por juego, estado o rango de fechas, o busca directamente por nombre.</p>

          <form id="form-filtros" className="panel-filtros" noValidate onSubmit={(e) => e.preventDefault()}>
            <div className="campo">
              <label htmlFor="filtro-busqueda">Buscar por nombre</label>
              <input type="search" id="filtro-busqueda" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Ej: Copa, Liga..." />
            </div>

            <div className="campo">
              <label htmlFor="filtro-juego">Juego</label>
              <select id="filtro-juego" value={juegoId} onChange={(e) => setJuegoId(e.target.value)}>
                <option value="">Todos</option>
                {JUEGOS.map((j) => (
                  <option key={j.id} value={j.id}>{j.nombre}</option>
                ))}
              </select>
            </div>

            <div className="campo">
              <label htmlFor="filtro-estado">Estado</label>
              <select id="filtro-estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="">Todos</option>
                <option value="abierto">Abierto</option>
                <option value="en_curso">En curso</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>

            <div className="campo">
              <label htmlFor="filtro-desde">Inicio desde</label>
              <input type="date" id="filtro-desde" value={desde} onChange={(e) => setDesde(e.target.value)} />
            </div>

            <div className="campo">
              <label htmlFor="filtro-hasta">Inicio hasta</label>
              <input type="date" id="filtro-hasta" value={hasta} onChange={(e) => setHasta(e.target.value)} />
            </div>

            <div className="campo" style={{ justifyContent: 'flex-end' }}>
              <button type="button" onClick={handleLimpiar} className="boton boton-secundario">Limpiar filtros</button>
            </div>
          </form>

          {error && <p className="mensaje-error" role="alert">{error}</p>}

          <div id="lista-torneos" className="grilla-tarjetas">
            {resultados.length ? (
              resultados.map((torneo) => {
                const juego = Datos.obtenerJuegoPorId(torneo.juegoId);
                const porcentaje = Math.min(100, Math.round((torneo.cupoOcupado / torneo.cupoMaximo) * 100));
                return (
                  <article className="tarjeta-torneo" key={torneo.id}>
                    <span className={`pastilla pastilla--${torneo.estado}`}>{Datos.nombreEstado(torneo.estado)}</span>
                    <h3>{torneo.nombre}</h3>
                    <p className="juego">{juego ? juego.nombre : "—"} · {torneo.modalidad}</p>
                    <div>
                      <div className="barra-cupo" role="img" aria-label={`${torneo.cupoOcupado} de ${torneo.cupoMaximo} cupos ocupados`}>
                        <span style={{ width: `${porcentaje}%` }}></span>
                      </div>
                      <p className="etiqueta-dato">{torneo.cupoOcupado} / {torneo.cupoMaximo} cupos</p>
                    </div>
                    <div className="fila-meta">
                      <span>Cierra inscripción</span>
                      <span>{torneo.fechaCierreInscripcion}</span>
                    </div>
                    <Link className="boton boton-secundario" to={`/inscripcion?id=${torneo.id}`}>Ver detalle</Link>
                  </article>
                );
              })
            ) : (
              <p className="estado-vacio">Ningún torneo cumple con los filtros seleccionados.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}