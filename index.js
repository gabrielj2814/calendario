// let fechaGlobal = moment("2023-06-06","YYYY-MM-DD")
moment.locale('es');
let fechaGlobal = moment()
let hoy = moment()
let totalDeSemanasMes=0;
let semana=[]
let semanasDelMes={}
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

let maquinas=[]
let maquinasFiltradasPorGrupo=[]
let ubicacionSemana=null
let indiceSemanaAnterior=0
let indiceSemanaSiguiente=0
let carriles={
    "turno_operador":"#18101f",
    "evento_maquina":"#431a2e",
    "otro":"#3061af",
}

let listaMaquinas=[
    {
        id_maquina:"9981083d-c84d-47ec-b363-2c7fa4b9be52",
        nombre_maquina:"maquina test 1",
        orden_maquina:"1",
        estado_maquina:"ACTIVO",
        siddex:"14",
        id_grupo:"1",
    },
    {
        id_maquina:"9981083d-cb9d-43e2-b0ce-ebac3dec6793",
        nombre_maquina:"maquina test 2",
        orden_maquina:"1",
        estado_maquina:"ACTIVO",
        siddex:"15",
        id_grupo:"1",
    },
    {
        id_maquina:"9981083d-d2b5-4259-9eff-11ca1b45f78c",
        nombre_maquina:"maquina test 3",
        orden_maquina:"1",
        estado_maquina:"ACTIVO",
        siddex:"90",
        id_grupo:"1",
    },
    {
        id_maquina:"9981083d-d2b5-4259-9eff-11ca1b45f78c",
        nombre_maquina:"maquina test g 2",
        orden_maquina:"1",
        estado_maquina:"ACTIVO",
        siddex:"90",
        id_grupo:"2",
    },
  ]

function cargarDiasDelMes2() {
  // let cabezeraCalendario2=document.getElementById("cabezeraCalendario")
  // obtenemos el numero de la semana en la que estamos actualmente en el años y mes especificado
  let fechaGlobal2 = moment("2023-06-01", "YYYY-MM-DD");
//   console.log(fechaGlobal2.format("dddd"));
  // fechaGlobal2.add(1,"month")
  let numeroSemanaActual2 = obtenerElNumeroDeSemanaActual(fechaGlobal2);
  // obtenemos el numero total de semanas del año y mes especificado
  let totalDeSemanasMes2 =
    obtenerElNumeroTotalDeSemanasQueTieneElMesActual(fechaGlobal2);
  // obtenemos el numero total de semanas del año y mes especificado
  let contador = 1;
  semanasDelMes = {};
  while (contador <= totalDeSemanasMes2) {
    semanasDelMes[contador] = obtenerLosDiasDeLaSemana(
      contador,
      fechaGlobal2.format("MM"),
      fechaGlobal2.format("YYYY")
    );
    contador = contador + 1;
  }
  document.getElementById("mesCalendario").textContent=mesesDelAnio[fechaGlobal2.month()]
}

function cargarDiasDelMes(indiceSemana=null) {
    // obtenemos el numero de la semana en la que estamos actualmente en el años y mes especificado


    totalDeSemanasMes=obtenerElNumeroTotalDeSemanasQueTieneElMesActual(fechaGlobal)
    // obtenemos el numero total de semanas del año y mes especificado
    let contador = 0;
    semanasDelMes = [];
    let semanasDelMesTmp=[]
    while(contador<=totalDeSemanasMes){
        semanasDelMesTmp.push(obtenerLosDiasDeLaSemana(contador,fechaGlobal.format("MM"),fechaGlobal.format("YYYY")))
        contador=contador+1
    }
    const INICO=obtenerPosicionDelArrayDeComienzoDeMes(semanasDelMesTmp,fechaGlobal)
    const FIN = obtenerPosicionDelArrayDeFinDeMes(semanasDelMesTmp,fechaGlobal)
    for (let index = INICO; index <= FIN; index++) {
        semanasDelMes.push(semanasDelMesTmp[index])
    }
    const SEMANA = ubicacioSemanaCustom(semanasDelMes,fechaGlobal)
    if(indiceSemana==null){
        ubicacionSemana=SEMANA
        totalDeSemanasMes=semanasDelMes.length
    }
    else{
        ubicacionSemana=indiceSemana
        totalDeSemanasMes=semanasDelMes.length
    }

    document.getElementById("mesCalendario").textContent=mesesDelAnio[fechaGlobal.month()]
    indiceSemanaAnterior=ubicacionSemana-1
    indiceSemanaSiguiente=ubicacionSemana+1
  }

function ubicacioSemanaCustom(array,fecha){
    let posicion=0
    let encontrado=false
    for (let index1 = 0; index1 < array.length; index1++) {
        let semana = array[index1];
        for (let index2 = 0; index2 < semana.length; index2++) {
            const dia = semana[index2];
            let fechaTMP=moment(dia.fecha,"YYYY-MM-DD")
            if(fechaTMP.format("YYYY-MM-DD")===fecha.format("YYYY-MM-DD")){
                encontrado=true
                break
            }
        }
        if(encontrado){
            posicion=index1
            break
        }
    }
    return posicion
}

function obtenerElNumeroDeSemanaActual(fecha) {
  const fechaActual = fecha;
  const numeroSemana =
    fechaActual.isoWeek() -
    fechaActual.clone().locale("es").startOf("month").isoWeek() +
    1;
  return numeroSemana;
}

function obtenerElNumeroTotalDeSemanasQueTieneElMesActual(fecha) {
  const primerDiaMes = moment()
    .month(fecha.month())
    .year(fecha.year())
    .startOf("month");

  // Obtener el último día del mes actual
  const ultimoDiaMes = moment()
    .month(fecha.month())
    .year(fecha.year())
    .endOf("month");

  // Calcular la diferencia en semanas entre el primer día y el último día del mes
  const totalSemanas = ultimoDiaMes.isoWeek() - primerDiaMes.isoWeek() + 1;


  return totalSemanas;
}

function obtenerLosDiasDeLaSemana(numeroSemana, mes, anio) {
    fecha= new Date() // Formato de fecha: "YYYY-MM-DD"
    fecha.setMonth((parseInt(mes) - 1))
    fecha.setFullYear(anio)
    const primerDiaMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
    const primerDiaSemana = new Date(primerDiaMes);
    primerDiaSemana.setDate(primerDiaMes.getDate() + (numeroSemana - 1) * 7);

    const diasSemana = [];

    // Definir los nombres de los días de la semana en español
    const nombresDias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Iterar por cada día de la semana
    let lunes=false
    let contador=0
    while(contador<7){
        if(nombresDias[primerDiaSemana.getDay()]=="Lunes"){
            lunes=true
        }
        if(lunes){
            const diaSemana = {
                dia: primerDiaSemana.getDate(),
                diaSemana: nombresDias[primerDiaSemana.getDay()],
                fecha: `${primerDiaSemana.getFullYear()}-${primerDiaSemana.getMonth() + 1}-${primerDiaSemana.getDate()}`
            };
            diasSemana.push(diaSemana);
            primerDiaSemana.setDate(primerDiaSemana.getDate() + 1);
            contador=contador+1
        }
        else{
            primerDiaSemana.setDate(primerDiaSemana.getDate() + 1);
        }

    }
    return diasSemana;
}

function obtenerPosicionDelArrayDeComienzoDeMes(array,mes){
    const primerDiaMes =mes.startOf('month');
    let posicion=0
    let encontrado=false
    for (let index1 = 0; index1 < array.length; index1++) {
        let semana = array[index1];
        for (let index2 = 0; index2 < semana.length; index2++) {
            const dia = semana[index2];
            if(parseInt(primerDiaMes.format("DD"))==dia.dia){
                encontrado=true
                break
            }
        }
        if(encontrado){
            posicion=index1
            break
        }
    }
    return posicion
}

function obtenerPosicionDelArrayDeFinDeMes(array,mes){
    const ultimoDiaMesActual = mes.endOf('month');
    let posicion=0
    let encontrado=false
    for (let index1 = array.length -1 ; index1 >= 0 ; index1--) {
        let semana = array[index1];
        for (let index2 = 0; index2 < semana.length; index2++) {
            const dia = semana[index2];
            if(parseInt(ultimoDiaMesActual.format("DD"))==dia.dia){
                encontrado=true
                break
            }
        }
        if(encontrado){
            posicion=index1
            break
        }
    }
    return posicion
}



function construirCalendario(maquinas,semana,carriles={}){
    // insertar dias de la semana
    
    let cabezeraCalendarioDias=document.getElementById("cabezeraCalendarioDias")
    cabezeraCalendarioDias.innerHTML=""
    let semanaHtml=semana.map(dia => {
        return `
        <div class=" border-solid border-slate-700 text-center" style="border-width: 1px;">
        <div>${dia.diaSemana}</div>
        <div>${dia.fecha}</div>
        </div>
        `
    }).join("")
    cabezeraCalendarioDias.innerHTML=semanaHtml
    
    // formatos datos calendario
    let filasCalendario=[];
    for (let index = 0; index < maquinas.length; index++) {
        const maquina = maquinas[index];
        filasCalendario.push({
            maquina:{...maquina},
            semana:[...semana],
        })
    }
    // contruir contenido calendario
    let cuerpoCalendario=document.getElementById("cuerpoCalendario")
    cuerpoCalendario.innerHTML=""
    for (const maquina of filasCalendario) {
            let idSemanaMaquina=`semana_${maquina.maquina.id_maquina}`
            let longitudCarriles=Object.entries(carriles).length
            console.log(longitudCarriles)
            let semanaHtml2=semana.map(dia => {
                let htmlCarriles=""
                for (const carril in carriles) {
                    // htmlCarriles+=`<div class="flex flex-row flex-wrap" id="${maquina.maquina.id_maquina}_${dia.fecha}_${carril}" style="background-color:${carriles[carril]};min-height:${100/longitudCarriles}%;"></div>`
                    htmlCarriles+=`<div class="flex flex-row flex-wrap" id="${maquina.maquina.id_maquina}_${dia.fecha}_${carril}" style="background-color:${carriles[carril]};min-height:50px;"></div>`
                }
                return `
                <div id="${maquina.maquina.id_maquina}_${dia.fecha}" class=" border-solid border-slate-700 text-center" style="border-width: 1px;">
                    ${htmlCarriles}
                </div>
                `
            }).join("")
           let  FilaCalendarioHtml=`
           <div class=" grid grid-cols-12" style="min-height: 80px;">
                <div class="col-span-3  border-solid border-slate-700 p-2" style="border-width: 1px;min-height: 80px;">${maquina.maquina.nombre_maquina}</div>
                <div class="col-span-9" style="min-height: 80px;">
                    <div class=" grid grid-cols-7" style="height: 100%;" id="${idSemanaMaquina}">
                        ${semanaHtml2}
                    </div>
                </div>
            </div>
           `
           cuerpoCalendario.innerHTML+=FilaCalendarioHtml
    }
}

function siguienteSemana(){
    if(indiceSemanaSiguiente<totalDeSemanasMes){
        construirCalendario(maquinasFiltradasPorGrupo,semanasDelMes[indiceSemanaSiguiente],carriles)
        ubicacionSemana+=1
        indiceSemanaSiguiente=ubicacionSemana+1
        indiceSemanaAnterior=ubicacionSemana-1
    }
    else{
        fechaGlobal.add(1,"month")
        document.getElementById("mesCalendario").textContent=mesesDelAnio[fechaGlobal.month()]
        cargarDiasDelMes(0)
        construirCalendario(maquinasFiltradasPorGrupo,semanasDelMes[ubicacionSemana],carriles)

    }
}

function semanaAnterior(){
    if(indiceSemanaAnterior>=0){
        construirCalendario(maquinasFiltradasPorGrupo,semanasDelMes[ubicacionSemana-1],carriles)
        ubicacionSemana-=1
        indiceSemanaAnterior=ubicacionSemana+1
        indiceSemanaAnterior=ubicacionSemana-1
    }
    else{
        fechaGlobal.subtract(1,"month")
        document.getElementById("mesCalendario").textContent=mesesDelAnio[fechaGlobal.month()]
        cargarDiasDelMes()
        construirCalendario(maquinasFiltradasPorGrupo,semanasDelMes[totalDeSemanasMes-1],carriles)

    }
}

function filtrarMaquinas(){
    let idGrupo=document.getElementById("selectGrupo").value
    maquinasFiltradasPorGrupo=listaMaquinas.filter(maquina => maquina.id_grupo.toString()===idGrupo)
    construirCalendario(maquinasFiltradasPorGrupo,semanasDelMes[ubicacionSemana],carriles)
    
}
cargarDiasDelMes();
// construirCalendario(listaMaquinas,semanasDelMes[ubicacionSemana])
filtrarMaquinas()
