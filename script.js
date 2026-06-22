// Función para cambiar de pestaña (Fase de Grupos / Bracket)
function cambiarPestana(pestana) {
    // Remover clase activa de todos los botones y secciones
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('activo'));
    document.querySelectorAll('.contenido-tab').forEach(sec => sec.classList.add('oculto'));

    // Activar el botón y la sección correspondiente
    if (pestana === 'grupos') {
        document.querySelector("button[onclick=\"cambiarPestana('grupos')\"]").classList.add('activo');
        document.getElementById('seccion-grupos').classList.remove('oculto');
    } else if (pestana === 'bracket') {
        document.querySelector("button[onclick=\"cambiarPestana('bracket')\"]").classList.add('activo');
        document.getElementById('seccion-bracket').classList.remove('oculto');
    }
}

// Función para cargar y renderizar los datos del torneo
async function cargarTorneo() {
    try {
        // Obtenemos los datos del archivo JSON local
        const respuesta = await fetch('torneo.json');
        const datos = await respuesta.json();
        
        const gridGrupos = document.getElementById('grid-grupos');
        gridGrupos.innerHTML = ''; // Limpiar el contenedor por si acaso

        // Recorrer cada grupo definido en el JSON
        for (const [nombreGrupo, jugadores] of Object.entries(datos.grupos)) {
            
            // ORDENAR JUGADORES: Primero por puntos, si empatan, por Kills de forma descendente
            const jugadoresOrdenados = [...jugadores].sort((a, b) => {
                if (b.puntos !== a.puntos) {
                    return b.puntos - a.puntos;
                }
                return b.kills - a.kills;
            });

            // Crear la estructura de la tarjeta del grupo
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

            // Construir las filas de cada jugador
            jugadoresOrdenados.forEach(jugador => {
                // Si el nombre es genérico o vacío, usar una skin predeterminada (Steve), si no, usar su nick
                const esPlaceholder = jugador.nombre.startsWith('Jugador_');
                const avatarUrl = esPlaceholder 
                    ? 'https://cravatar.eu/helm/Steve/24.png'
                    : `https://cravatar.eu/helm/${jugador.nombre}/24.png`;

                // Determinar la clase visual según su estado (pendiente, clasificado, eliminado)
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

            tablaHTML += `
                    </tbody>
                </table>
            `;

            tarjeta.innerHTML = tablaHTML;
            gridGrupos.appendChild(tarjeta);
        }

    } catch (error) {
        console.error('Error cargando el archivo torneo.json:', error);
        document.getElementById('grid-grupos').innerHTML = `<p class="centro">Error al cargar las estadísticas. Revisa la consola o el archivo JSON.</p>`;
    }
}

// Ejecutar la carga del torneo cuando la página termine de leer el documento HTML
document.addEventListener('DOMContentLoaded', cargarTorneo);