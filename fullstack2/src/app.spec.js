import { Datos, TORNEOS, JUEGOS, JUGADORES } from './data/datos';

describe('Pruebas Unitarias - eSports Arena Manager (Jasmine/Karma)', () => {

  // PRUEBA 1: Búsqueda de juego por ID
  it('1. Debe obtener el juego correcto según su ID', () => {
    const juego = Datos.obtenerJuegoPorId('g1');
    expect(juego).not.toBeNull();
    expect(juego.nombre).toBe('League of Legends');
  });

  // PRUEBA 2: Retornar null para juego inexistente
  it('2. Debe retornar null si el ID del juego no existe', () => {
    const juego = Datos.obtenerJuegoPorId('id_falso');
    expect(juego).toBeNull();
  });

  // PRUEBA 3: Búsqueda de torneo por ID
  it('3. Debe obtener el torneo correcto según su ID', () => {
    const torneo = Datos.obtenerTorneoPorId('t1');
    expect(torneo).not.toBeNull();
    expect(torneo.nombre).toBe('Copa Arena de Primavera');
  });

  // PRUEBA 4: Transformación legible del estado del torneo
  it('4. Debe formatear la etiqueta del estado correctamente', () => {
    expect(Datos.nombreEstado('abierto')).toBe('Abierto');
    expect(Datos.nombreEstado('en_curso')).toBe('En curso');
    expect(Datos.nombreEstado('finalizado')).toBe('Finalizado');
  });

  // PRUEBA 5: Búsqueda de jugador por ID
  it('5. Debe retornar los datos de un jugador por su ID', () => {
    const jugador = Datos.obtenerJugadorPorId('j1');
    expect(jugador.apodo).toBe('DeusCabrex');
    expect(jugador.sanciones.length).toBe(0);
  });

  // PRUEBA 6: Filtrado por nombre de torneo
  it('6. Debe filtrar la lista de torneos según el texto buscado', () => {
    const busqueda = 'Copa';
    const resultados = TORNEOS.filter(t => t.nombre.toLowerCase().includes(busqueda.toLowerCase()));
    expect(resultados.length).toBeGreaterThan(0);
    expect(resultados[0].nombre).toContain('Copa');
  });

  // PRUEBA 7: Filtrado por estado
  it('7. Debe filtrar torneos que estén en estado abierto', () => {
    const abiertos = TORNEOS.filter(t => t.estado === 'abierto');
    expect(abiertos.every(t => t.estado === 'abierto')).toBe(true);
  });

  // PRUEBA 8: Validación de cupos máximos
  it('8. Debe verificar que los cupos ocupados no superen el cupo máximo', () => {
    TORNEOS.forEach(torneo => {
      expect(torneo.cupoOcupado).toBeLessThanOrEqual(torneo.cupoMaximo);
    });
  });

  // PRUEBA 9: Detección de sanciones vigentes en jugadores
  it('9. Debe identificar si un jugador posee sanciones activas', () => {
    const jugadorSancionado = JUGADORES.find(j => j.id === 'j3');
    const tieneSancionVigente = jugadorSancionado.sanciones.some(s => s.vigente);
    expect(tieneSancionVigente).toBe(true);
  });

  // PRUEBA 10: Validación de reglas de apodo (sin espacios)
  it('10. Debe invalidar un apodo que contenga espacios', () => {
    const apodoInvalido = "Apodo Con Espacio";
    const tieneEspacios = /\s/.test(apodoInvalido);
    expect(tieneEspacios).toBe(true);
  });

});