// Función para cambiar de pestaña dinámicamente
function cambiarPestana(pestana) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('activo'));
    document.querySelectorAll('.contenido-tab').forEach(sec => sec.classList.add('oculto'));

    const botonActivo = document.querySelector(`button[onclick="cambiarPestana('${pestana}')"]`);
    if (botonActivo) botonActivo.classList.add('activo');

    const seccionActiva = document.getElementById(`seccion-${pestana}`);
    if (seccionActiva) seccionActiva.classList.remove('oculto');
}

// Función para alternar entre Modo Claro y Oscuro
function alternarTema() {
    const htmlElement = document.documentElement;
    const botonTema = document.getElementById('theme-toggle');
    const temaActual = htmlElement.getAttribute('data-theme');
    
    if (temaActual === 'dark') {
        htmlElement.setAttribute('data-theme', 'light');
        botonTema.innerText = '🌙 Modo Oscuro';
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        botonTema.innerText = '☀️ Modo Claro';
    }
}

// FUNCIÓN CON API ANTIBLOQUEO (ASHCON)
async function cargarTorneo() {
    try {
        const respuesta = await fetch('torneo.json');
        const datos = await respuesta.json();
        
        const gridGrupos = document.getElementById('grid-grupos');
        gridGrupos.innerHTML = '';

        for (const [nombreGrupo, jugadores] of Object.entries(datos.grupos)) {
            
            // ORDENAR JUGADORES: Por puntos, y desempate por Kills
            const jugadoresOrdenados = [...jugadores].sort((a, b) => {
                if (b.puntos !== a.puntos) {
                    return b.puntos - a.puntos;
                }
                return b.kills - a.kills;
            });

            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-grupo';

            let tablaHTML = `
                <h2>${nombreGrupo}</h2>
                <table class="tabla-grupo">
                    <thead>
                        <tr>
                            <th>Jugador</th>
                            <th class="centro">Pts</th>
                            <th class="centro">K</th>
                            <th class="centro">D</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            jugadoresOrdenados.forEach(jugador => {
                const esPlaceholder = jugador.nombre.startsWith('Cupo_Disponible');
                
                // API ALTERNATIVA: Ashcon Avatar Generator (Altamente compatible con navegadores)
                // Usamos la skin por defecto de Steve (id: 606e2ff0ed77487da194393e7d1a3d28) si es cupo libre
                const avatarUrl = esPlaceholder 
                    ? 'https://api.ashcon.app/mojang/v2/avatar/606e2ff0ed77487da194393e7d1a3d28'
                    : `https://api.ashcon.app/mojang/v2/avatar/${jugador.nombre}`;

                let claseEstado = 'fila-jugador';
                if (jugador.estado === 'clasificado') claseEstado += ' clasificado';
                if (jugador.estado === 'eliminado') claseEstado += ' eliminado';

                tablaHTML += `
                    <tr class="${claseEstado}">
                        <td class="celda-jugador">
                            <div class="avatar-contenedor">
                                <img src="${avatarUrl}" 
                                     alt="${jugador.nombre}" 
                                     class="avatar-head" 
                                     crossorigin="anonymous"
                                     onerror="this.onerror=null; this.src='https://api.ashcon.app/mojang/v2/avatar/606e2ff0ed77487da194393e7d1a3d28';">
                            </div>
                            <strong class="nick-jugador">${jugador.nombre}</strong>
                        </td>
                        <td class="centro"><strong>${jugador.puntos}</strong></td>
                        <td class="centro">${jugador.kills}</td>
                        <td class="centro">${jugador.deaths}</td>
                    </tr>
                `;
            });

            tablaHTML += `</tbody></table>`;
            tarjeta.innerHTML = tablaHTML;
            gridGrupos.appendChild(tarjeta);
        }

    } catch (error) {
        console.error('Error cargando el archivo torneo.json:', error);
        document.getElementById('grid-grupos').innerHTML = `<p class="centro">Error al cargar las estadísticas. Revisa la consola o el archivo JSON.</p>`;
    }
}

// Iniciar carga al estar listo el DOM
document.addEventListener('DOMContentLoaded', cargarTorneo);
