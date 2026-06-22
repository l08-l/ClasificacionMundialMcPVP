// Función para cambiar de pestaña dinámicamente
function cambiarPestana(pestana) {
    // Romper enlace de activo en todos los botones y ocultar secciones
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('activo'));
    document.querySelectorAll('.contenido-tab').forEach(sec => sec.classList.add('oculto'));

    // Activar el botón correspondiente usando su atributo de onclick
    const botonActivo = document.querySelector(`button[onclick="cambiarPestana('${pestana}')"]`);
    if (botonActivo) botonActivo.classList.add('activo');

    // Mostrar la sección correspondiente
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

// Función para cargar y renderizar los datos del torneo
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
                const esPlaceholder = jugador.nombre.startsWith('Jugador_');
                const avatarUrl = esPlaceholder 
                    ? 'https://cravatar.eu/helm/Steve/24.png'
                    : `https://cravatar.eu/helm/${jugador.nombre}/24.png`;

                let claseEstado = 'fila-jugador';
                if (jugador.estado === 'clasificado') claseEstado += ' clasificado';
                if (jugador.estado === 'eliminado') claseEstado += ' eliminado';

                tablaHTML += `
                    <tr class="${claseEstado}">
                        <td>
                            <img src="${avatarUrl}" alt="${jugador.nombre}" class="avatar-head">
                            <strong>${jugador.nombre}</strong>
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
