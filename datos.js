const torneos = [
    {
        id: 1,
        nombre: "Copa League of Legends",
        juego: "1",
        modalidad: "5v5",
        estado: "ABIERTO",
        fechaInicio: "2026-09-15",
        fechaFin: "2026-09-25",
        cuposOcupados: 12,
        cupoMaximo: 16,
        destacado: true
    },
    {
        id: 2,
        nombre: "Valorant World",
        juego: "2",
        modalidad: "5v5",
        estado: "ABIERTO",
        fechaInicio: "2026-09-10",
        fechaFin: "2026-09-12",
        cuposOcupados: 8,
        cupoMaximo: 8,
        destacado: true
    },
    {
        id: 3,
        nombre: "Torneito CS2",
        juego: "3",
        modalidad: "5v5",
        estado: "EN_CURSO",
        fechaInicio: "2026-09-03",
        fechaFin: "2026-09-10",
        cuposOcupados: 16,
        cupoMaximo: 16,
        destacado: false
    },
    {
        id: 4,
        nombre: "Rocket League Champions",
        juego: "1",
        modalidad: "2v2",
        estado: "FINALIZADO",
        fechaInicio: "2026-08-01",
        fechaFin: "2026-08-20",
        cuposOcupados: 32,
        cupoMaximo: 32,
        destacado: false
    }

];

console.log("Datos cargados correctamente:", torneos);