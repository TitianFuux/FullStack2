import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TORNEOS, EQUIPOS, Datos } from '../data/datos';

export default function Inscripcion() {
  const [searchParams] = useSearchParams();
  const torneoId = searchParams.get('id');

  const torneo = TORNEOS.find(t => t.id === torneoId) || TORNEOS[0];
  const juego = torneo ? Datos.obtenerJuegoPorId(torneo.juegoId) : null;

  const [tipoParticipante, setTipoParticipante] = useState('');
  const [equipoId, setEquipoId] = useState('');
  const [errorTipo, setErrorTipo] = useState('');
  const [errorEquipo, setErrorEquipo] = useState('');
  const [confirmado, setConfirmado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let valido = true;

    if (!tipoParticipante) {
      setErrorTipo('Debes seleccionar cómo te inscribirás.');
      valido = false;
    } else {
      setErrorTipo('');
    }

    if (tipoParticipante === 'equipo' && !equipoId) {
      setErrorEquipo('Debes seleccionar tu equipo.');
      valido = false;
    } else {
      setErrorEquipo('');
    }

    if (valido) {
      setConfirmado(true);
    }
  };

  return (
    <main id="contenido-principal">
      <section className="franja">
        <div className="contenedor">
          <h1>Inscripción a Torneo: {torneo?.nombre}</h1>

          <div className="dos-columnas">
            <div>
              <article>
                <img 
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80" 
                  alt="Banner Oficial del Torneo" 
                  style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', borderRadius: 'var(--radio-borde)', border: '1px solid var(--color-borde)', marginBottom: '1rem' }} 
                />
                <div id="detalle-torneo">
                  <p><strong>Juego:</strong> {juego?.nombre || '—'}</p>
                  <p><strong>Modalidad:</strong> {torneo?.modalidad}</p>
                  <p><strong>Cierre de Inscripción:</strong> {torneo?.fechaCierreInscripcion}</p>
                </div>
                <h2 style={{ marginTop: '1.5rem' }}>Requisitos del Torneo</h2>
                <ul id="lista-requisitos" className="lista-integrantes">
                  <li className="integrante">Edad mínima de 13 años.</li>
                  <li className="integrante">Sin sanciones disciplinarias vigentes.</li>
                  {torneo?.modalidad === 'Equipos' && (
                    <li className="integrante">Nómina completa de equipo ({juego?.integrantesPorEquipo} jugadores).</li>
                  )}
                </ul>
              </article>

              <article style={{ marginTop: '2rem' }}>
                <h2>Tráiler y Reglamento del Torneo</h2>
                <div className="marco-video">
                  <iframe 
                    width="100%" 
                    height="320" 
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                    title="Tráiler del Torneo" 
                    style={{ border: 0 }} 
                    allowFullScreen>
                  </iframe>
                </div>
              </article>
            </div>

            <div>
              <h2>Formulario de Registro</h2>
              <form id="form-inscripcion" className="formulario" autoComplete="on" noValidate onSubmit={handleSubmit}>
                <div className="campo">
                  <label htmlFor="tipo-participante">¿Cómo se inscribirá?</label>
                  <select 
                    id="tipo-participante" 
                    value={tipoParticipante} 
                    onChange={(e) => setTipoParticipante(e.target.value)} 
                    required>
                    <option value="">Selecciona una opción</option>
                    <option value="equipo">Equipo</option>
                  </select>
                  {errorTipo && <span className="mensaje-error">{errorTipo}</span>}
                </div>

                {tipoParticipante === 'equipo' && (
                  <div className="campo" id="contenedor-selector-equipo">
                    <label htmlFor="selector-equipo">Selecciona tu equipo</label>
                    <select 
                      id="selector-equipo" 
                      value={equipoId} 
                      onChange={(e) => setEquipoId(e.target.value)}>
                      <option value="">Selecciona un equipo</option>
                      {EQUIPOS.map((eq) => (
                        <option key={eq.id} value={eq.id}>{eq.nombre}</option>
                      ))}
                    </select>
                    {errorEquipo && <span className="mensaje-error">{errorEquipo}</span>}
                  </div>
                )}

                <button type="submit" className="boton boton-primario">Confirmar inscripción</button>
              </form>

              {confirmado && (
                <div id="confirmacion" className="aviso aviso--exito" style={{ marginTop: '1rem' }}>
                  <h2>¡Inscripción confirmada!</h2>
                  <p id="detalle-confirmacion">Tu equipo ha quedado registrado con éxito para {torneo?.nombre}.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}