let aleatorio;
let arrayCartas = [];
let cont = 0;
let arrJuego = [];
let cont_aciertos = 0;
let cont_fallos = 0;
let record = 0;
let recordString = 0;
var tim = 0;
let tiempo2 = 0;
let tiempo = 0;
let tInicio;
let $sg;
let $mn;

$(document).ready(function () {
  let inRecord = $("#tiempoRecord");
  let datoRecord = localStorage.getItem("Record");
  let datoRecordString = localStorage.getItem("RecordString");
  if (datoRecord != undefined && datoRecordString != undefined) {
    try {
      record = JSON.parse(datoRecord);
      recordString = JSON.parse(datoRecordString);
      $(inRecord).val(recordString);
    } catch (e) {
      console.log("error al convertir");
    }
  }

  var $cartas = $(".carta");
  let btnIniciar = $(".btn-iniciar");
  $(btnIniciar).on("click", cargarTablero);
  let btnReiniciar = $(".btn-reiniciar");
  $(btnReiniciar).on("click", reiniciarTablero);

  function cargarTablero() {
    $(btnIniciar).prop("disabled", true);
    var inTiempo = $("[name='tiempo']");
    tInicio = new Date();
    tInicio = tInicio.getTime() / 1000;

    tim = setInterval(() => {
      let actual = new Date();
      actual = actual.getTime() / 1000;
      tiempo = actual - tInicio;
      let min = parseInt(tiempo / 60) % 60;
      let seg = parseInt(tiempo % 60);
      if (min < 10) min = "0" + min;
      if (seg < 10) seg = "0" + seg;
      tiempo = min + ":" + seg;

      $(inTiempo).val(tiempo);
    }, 100);

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j >= 0; j++) {
        aleatorio = Math.floor(Math.random() * 16);
        if (arrayCartas[aleatorio] == undefined) {
          $("#c" + aleatorio).css(
            "backgroundImage",
            "url(../img/" + i + ".jpeg"
          );
          arrayCartas[aleatorio] = i;
          cont++;
        }
        if (cont == 2) {
          break;
        }
      }
      cont = 0;
    }
    $cartas.on("click", function () {
      var id = $(this).index(".carta");
      if (arrJuego.length < 2 && tiempo != 0) {
        abrirCarta(id);
      }
    });
  }
  //OBJETIVO 1
  function abrirCarta(ide) {
    $cartas[ide].classList.add("open");

    if (!arrJuego.includes(ide)) arrJuego.push(ide);

    if (arrJuego.length == 2) {
      let carta1 = arrJuego[0];
      let carta2 = arrJuego[1];

      //OBJETIVO2 Y 3
      if (arrayCartas[carta1] === arrayCartas[carta2]) {
        cont_aciertos++;
        $("#avisoAcertaste").toggleClass("d-flex");
        $("#avisoAcertaste").fadeIn();
        $("#avisoAcertaste").animate(
          {
            opacity: "0.2",
          },
          3000,
          function () {
            $("#avisoAcertaste").css("opacity", "1");
            $("#avisoAcertaste").toggleClass("d-flex");
            arrJuego = [];
          }
        );
      } else {
        cont_fallos++;
        $("#avisoFallaste").toggleClass("d-flex");
        $("#avisoFallaste").fadeIn();
        $("#avisoFallaste").animate(
          {
            opacity: "0.3",
          },
          3000,
          function () {
            $("#avisoFallaste").css("opacity", "1");
            $("#avisoFallaste").toggleClass("d-flex");
            $($cartas[carta1]).removeClass("open");
            $($cartas[carta2]).removeClass("open");
            arrJuego = [];
          }
        );
      }

      comprobarAciertos();
    }
  }
  //OBJETIVO4
  function comprobarAciertos() {
    let aciertos = $("[name='aciertos']");
    $(aciertos).val(cont_aciertos);
    let fallos = $("[name='fallos']");
    $(fallos).val(cont_fallos);

    if (cont_aciertos == 8) {
      let tFinal = new Date();
      tFinal = tFinal.getTime() / 1000;
      tiempo2 = tFinal - tInicio;
      let min2 = parseInt(tiempo2 / 60) % 60;
      let seg2 = parseInt(tiempo2 % 60);

      if (min2 < 10) min2 = "0" + min2;
      if (seg2 < 10) seg2 = "0" + seg2;

      clearInterval(tim);
      $("#exampleModal").modal("show");

      //OBJETIVO5
      if (record == 0 || record > tiempo2) {
        record = tiempo2;
        recordString = min2 + ":" + seg2;
        $(inRecord).val(recordString);
        localStorage.setItem("Record", JSON.stringify(record));
        localStorage.setItem("RecordString", JSON.stringify(recordString));
        $("#nuevo-record").removeClass("d-none");
      }
    }
  }
  function reiniciarTablero() {
    clearInterval(tim);
    $(btnIniciar).prop("disabled", false);
    $($cartas).removeClass("open");
    tiempo = 0;
    $("[name='tiempo']").val(tiempo);
    aleatorio = "";
    arrayCartas = [];
    arrJuego = [];
    cont_aciertos = 0;
    $("[name='aciertos']").val(cont_aciertos);
    cont_fallos = 0;
    $("[name='fallos']").val(cont_fallos);
    tiempo2 = 0;
  }
});
