// la libreria hace mal los calculo si cae un primero de cada mes
let numeroSemanaActual=null;
// let fechaGlobal = moment("2023-06-06","YYYY-MM-DD")
let fechaGlobal = moment()
let hoy = moment()
let totalDeSemanasMes=0;
let semana=[]
let semanasDelMes={}
moment.locale('es');
const mesesDelAnio = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
]

let ordenesMaquinas=[]
let maquinas=[]
let posiciones={}


function consultarData(){
    const url = "/v1/planificacion-semanal/consultar";
    document.getElementById("loader").style.display = "flex";
    fetch(url, {
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("respuesta -> ", data);
        document.getElementById("loader").style.display = "none";
        insertarMaquinasEnCalendario(data.maquinas)
        maquinas=JSON.parse(JSON.stringify(data.maquinas))
        posiciones=JSON.parse(JSON.stringify(data.posiciones))
        ordenesMaquinas=JSON.parse(JSON.stringify(data.maquinaOrdenes))
    })
    .catch((error) => {
        console.error(error);
        document.getElementById("loader").style.display = "none";

    });
}

function insertarMaquinasEnCalendario(maquinas){
    let tbody=document.getElementById("tbody")
    tbody.innerHTML=""
    for (const maquina of maquinas) {
        let columnasSemanasCalendario=semana.map(semana => {
            return `
            <td style="text-align: center;">
                ${semana.dia}
            </td>
            `
            // return `
            // <td style="text-align: center;">

            // </td>
            // `
        }).join("")
        let fila=`
        <tr style="">
            <td>
                <button class="btn btn-secondary-2-custom w-full" style="text-align: start;" onclick="mostrarOrdenesMaquina('${maquina.id}','${maquina.nombre}')">
                    ${maquina.nombre}
                </button>
            </td>
            ${columnasSemanasCalendario}
            <td>

            </td>
        </tr>
        `
        tbody.innerHTML+=fila
    }
}

function mostrarOrdenesMaquina(idMaquina,nombreMaquina){
    document.getElementById("maquina-modal").textContent=nombreMaquina
    document.getElementById("contendor-modal").classList.remove("ocultar-modal")
    let listaOrdenes=document.getElementById("listaOrdenes")
    listaOrdenes.innerHTML=""
    console.log("ordenes maquinas => ",ordenesMaquinas[idMaquina])
    let orden=ordenesMaquinas[idMaquina].map( orden => {
        return `
        <div class="grid grid-cols-12 p-2">
           <div class=" col-span-2">
               <input type="checkbox" class="ordenesMaquina" value="${orden[posiciones["id_orden"]]}">
           </div>
           <div class=" col-span-7">${orden[posiciones["order_trabajo"]]} - ${orden[posiciones["nombre_maquina"]]}</div>
           <div class=" col-span-2">${orden[posiciones["tiempo"]]}</div>
        </div>
        `
    }).join("")
    listaOrdenes.innerHTML=orden
}

function cerrarModalOrdenesMaquina(){
    document.getElementById("contendor-modal").classList.add("ocultar-modal")
}

function asginarOrdenes(){
    let ordenesCheckbox=document.querySelectorAll(".ordenesMaquina")
    let ordenesSeleccionadas=[]
    for (let index = 0; index < ordenesCheckbox.length; index++) {
        const orden = ordenesCheckbox[index];
        if(orden.checked==true){
            ordenesSeleccionadas.push(orden.value)
        }

    }
    let data={
        fechaHoy:hoy.format("YYYY-MM-DD"),
        ordenes:ordenesSeleccionadas
    }
    console.log("data a enviar => ",data)
}
// ###########
// ###########
// ###########
function obtenerElNumeroDeSemanaActual(fecha) {
    const fechaActual = fecha;
    const numeroSemana = fechaActual.isoWeek() - fechaActual.clone().locale('es').startOf('month').isoWeek() + 1;
    // console.log(`Número de la semana del mes actual: ${numeroSemana}`);
    return numeroSemana;
  }

function obtenerElNumeroTotalDeSemanasQueTieneElMesActual(fecha){
    const primerDiaMes = moment().month(fecha.month()).year(fecha.year()).startOf('month');

    // Obtener el último día del mes actual
    const ultimoDiaMes = moment().month(fecha.month()).year(fecha.year()).endOf('month');

    // Calcular la diferencia en semanas entre el primer día y el último día del mes
    const totalSemanas = ultimoDiaMes.isoWeek() - primerDiaMes.isoWeek() + 1;

    // console.log(`Total de semanas del mes actual: ${totalSemanas}`);

    return totalSemanas
}

function obtenerLosDiasDeLaSemana(numeroSemana,mes,anio){
    fecha= new Date() // Formato de fecha: "YYYY-MM-DD"
    fecha.setMonth((parseInt(mes) - 1))
    fecha.setFullYear(anio)
    console.log("mes daye => ",fecha.getMonth())
    const primerDiaMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    const primerDiaSemana = new Date(primerDiaMes);
    console.log((primerDiaMes.getDate() + (numeroSemana - 1) * 7))
    primerDiaSemana.setDate(primerDiaMes.getDate() + (numeroSemana - 1) * 7);

    const diasSemana = [];

    // Definir los nombres de los días de la semana en español
    const nombresDias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Iterar por cada día de la semana
    let lunes=false
    let contador=0
    while(contador<7){
        console.log("index dia de semana ",primerDiaSemana.getDate()," ",primerDiaSemana.getDay()," ",nombresDias[primerDiaSemana.getDay()])
        if(nombresDias[primerDiaSemana.getDay()]=="Lunes"){
            lunes=true
        }
        if(lunes){
            const diaSemana = {
                dia: primerDiaSemana.getDate(),
                diaSemana: nombresDias[primerDiaSemana.getDay()]
            };
            diasSemana.push(diaSemana);
            primerDiaSemana.setDate(primerDiaSemana.getDate() + 1);
            contador=contador+1
        }
        else{
            primerDiaSemana.setDate(primerDiaSemana.getDate() + 1);
        }

    }
    // for (let dia = 0; dia < 7; dia++) {
    //   const diaSemana = {
    //     dia: primerDiaSemana.getDate(),
    //     diaSemana: nombresDias[primerDiaSemana.getDay()]
    //   };
    //   diasSemana.push(diaSemana);
    //   primerDiaSemana.setDate(primerDiaSemana.getDate() + 1);
    // }

    // console.log("Días de la semana", numeroSemana, diasSemana);
    return diasSemana;
}

function cargarCalendario(){
    let cabezeraCalendario=document.getElementById("cabezeraCalendario")
    // obtenemos el numero de la semana en la que estamos actualmente en el años y mes especificado
    numeroSemanaActual=obtenerElNumeroDeSemanaActual(fechaGlobal)
    console.log(numeroSemanaActual)
    // obtenemos el numero total de semanas del año y mes especificado
    totalDeSemanasMes=obtenerElNumeroTotalDeSemanasQueTieneElMesActual(fechaGlobal)
    // obtenemos el numero total de semanas del año y mes especificado
    semana=obtenerLosDiasDeLaSemana(numeroSemanaActual,fechaGlobal.format("MM"),fechaGlobal.format("YYYY"))
    document.getElementById("mesCalendario").textContent=mesesDelAnio[fechaGlobal.month()]
    let formatoSemana=semana.map(dia => {
        return `
        <th>
           ${dia.diaSemana}</br>
           ${dia.dia}
        </th>
        `
    })
    cabezeraCalendario.innerHTML=`
    <th style="display: flex;flex-direction: row;justify-content: end;">
       <button class="btn btn-primary-custom" id="semanaAnterior" onclick="semanaAnterior(${numeroSemanaActual-1})">Anterior</button>
    </th>
    ${formatoSemana.join("")}
    <th style="display: flex;flex-direction: row;">
        <button class="btn btn-primary-custom" id="semanaSiguiente" onclick="siguienteSemana(${numeroSemanaActual+1})">Siguiente</button>
    </th>
    `
}

function cargarCalendario2(){
    // let cabezeraCalendario2=document.getElementById("cabezeraCalendario")
    // obtenemos el numero de la semana en la que estamos actualmente en el años y mes especificado
    let fechaGlobal2=moment("2023-06-01","YYYY-MM-DD")
    console.log(fechaGlobal2.format("dddd"))
    // fechaGlobal2.add(1,"month")
    let numeroSemanaActual2=obtenerElNumeroDeSemanaActual(fechaGlobal2)
    // obtenemos el numero total de semanas del año y mes especificado
    let totalDeSemanasMes2=obtenerElNumeroTotalDeSemanasQueTieneElMesActual(fechaGlobal2)
    // obtenemos el numero total de semanas del año y mes especificado
    let contador=1
    semanasDelMes={}
    while(contador<=totalDeSemanasMes2){
        semanasDelMes[contador]=obtenerLosDiasDeLaSemana(contador,fechaGlobal2.format("MM"),fechaGlobal2.format("YYYY"))
        contador=contador+1
    }
    console.log("mes => ",semanasDelMes)
    // let semana2=obtenerLosDiasDeLaSemana(0,fechaGlobal2.format("YYYY-MM-DD"))
    // console.log("semana 2 => ",semana2)
    // document.getElementById("mesCalendario").textContent=mesesDelAnio[fechaGlobal2.month()]
}

cargarCalendario2()

function siguienteSemana(numero){
    let cabezeraCalendario=document.getElementById("cabezeraCalendario")
    if(numero<=totalDeSemanasMes){
        // numeroSemanaActual=totalDeSemanasMes
        semana=obtenerLosDiasDeLaSemana(numero,fechaGlobal.format("MM"),fechaGlobal.format("YYYY"))
        let formatoSemana=semana.map(dia => {
            return `
            <th>
            ${dia.diaSemana}</br>
            ${dia.dia}
            </th>
            `
        })
        cabezeraCalendario.innerHTML=`
        <th style="display: flex;flex-direction: row;justify-content: end;">
            <button class="btn btn-primary-custom" id="semanaAnterior" onclick="semanaAnterior(${numero-1})">Anterior</button>
        </th>
        ${formatoSemana.join("")}
        <th style="display: flex;flex-direction: row;">
            <button class="btn btn-primary-custom" id="semanaSiguiente" onclick="siguienteSemana(${numero+1})">Siguiente</button>
        </th>
        `
    }
    else{
        fechaGlobal.add(1,"month")
        document.getElementById("mesCalendario").textContent=mesesDelAnio[fechaGlobal.month()]
        // obtenemos el numero total de semanas del año y mes especificado
        totalDeSemanasMes=obtenerElNumeroTotalDeSemanasQueTieneElMesActual(fechaGlobal)
        // obtenemos el numero total de semanas del año y mes especificado
        semana=obtenerLosDiasDeLaSemana(1,fechaGlobal.format("MM"),fechaGlobal.format("YYYY"))
        let formatoSemana=semana.map(dia => {
            return `
            <th>
               ${dia.diaSemana}</br>
               ${dia.dia}
            </th>
            `
        })
        cabezeraCalendario.innerHTML=`
        <th style="display: flex;flex-direction: row;justify-content: end;">
           <button class="btn btn-primary-custom" id="semanaAnterior" onclick="semanaAnterior(${1-1})">Anterior</button>
        </th>
        ${formatoSemana.join("")}
        <th style="display: flex;flex-direction: row;">
            <button class="btn btn-primary-custom" id="semanaSiguiente" onclick="siguienteSemana(${1+1})">Siguiente</button>
        </th>
        `
    }
    insertarMaquinasEnCalendario(maquinas)
}

function semanaAnterior(numero){
    let cabezeraCalendario=document.getElementById("cabezeraCalendario")
    if(numero>0){
        // numeroSemanaActual=totalDeSemanasMes
        semana=obtenerLosDiasDeLaSemana(numero,fechaGlobal.format("MM"),fechaGlobal.format("YYYY"))
        let formatoSemana=semana.map(dia => {
            return `
            <th>
            ${dia.diaSemana}</br>
            ${dia.dia}
            </th>
            `
        })
        cabezeraCalendario.innerHTML=`
        <th style="display: flex;flex-direction: row;justify-content: end;">
            <button class="btn btn-primary-custom" id="semanaAnterior" onclick="semanaAnterior(${numero-1})">Anterior</button>
        </th>
        ${formatoSemana.join("")}
        <th style="display: flex;flex-direction: row;">
            <button class="btn btn-primary-custom" id="semanaSiguiente" onclick="siguienteSemana(${numero+1})">Siguiente</button>
        </th>
        `
    }
    else{

        fechaGlobal.subtract(1,"month")
        document.getElementById("mesCalendario").textContent=mesesDelAnio[fechaGlobal.month()]
        // obtenemos el numero total de semanas del año y mes especificado
        totalDeSemanasMes=obtenerElNumeroTotalDeSemanasQueTieneElMesActual(fechaGlobal)
        // obtenemos el numero total de semanas del año y mes especificado
        semana=obtenerLosDiasDeLaSemana(totalDeSemanasMes,fechaGlobal.format("MM"),fechaGlobal.format("YYYY"))
        let formatoSemana=semana.map(dia => {
            return `
            <th>
               ${dia.diaSemana}</br>
               ${dia.dia}
            </th>
            `
        })
        cabezeraCalendario.innerHTML=`
        <th style="display: flex;flex-direction: row;justify-content: end;">
           <button class="btn btn-primary-custom" id="semanaAnterior" onclick="semanaAnterior(${totalDeSemanasMes-1})">Anterior</button>
        </th>
        ${formatoSemana.join("")}
        <th style="display: flex;flex-direction: row;">
            <button class="btn btn-primary-custom" id="semanaSiguiente" onclick="siguienteSemana(${totalDeSemanasMes+1})">Siguiente</button>
        </th>
        `
    }
    insertarMaquinasEnCalendario(maquinas)
}

// cargarCalendario()

// consultarData()