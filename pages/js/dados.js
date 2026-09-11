// ABRIR AGENDA 
const agendaLink = document.getElementById('agenda');
 
agendaLink.addEventListener('click', function (event) { 
    event.preventDefault();
    document.querySelector('.calendar').style.display = 'block';
});
 
 
// ELEMENTOS DO CALENDÁRIO 
const mesAnoElm = document.getElementById('mes-ano'); 
const diasElm = document.getElementById('dias-calendario'); 
const eventosElm = document.getElementById('eventos');
  
// DATA ATUAL 
const dataAtual = new Date();
 
let ano = dataAtual.getFullYear(); 
let mes = dataAtual.getMonth();
 
// NOMES DOS MESES
const nomesMeses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
];
 
 
// EVENTOS 
const eventos = {
    "2026-09-15": "Reunião importante"
};
 
// CARREGAR CALENDÁRIO
function carregarCalendario() {
    mesAnoElm.innerText = `${nomesMeses[mes]} de ${ano}`;
 
    const primeiroDiaIndex = new Date(ano, mes, 1).getDay();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
 
    let diasHtml = '';
 
    // espaços antes do primeiro dia
 
    for (let i = 0; i < primeiroDiaIndex; i++) {
        diasHtml += `<div></div>`;
    }
 
    // dias do mês
 
    for (let dia = 1; dia <= ultimoDia; dia++) {
        const diaStr = String(dia).padStart(2, '0');
        const mesStr = String(mes + 1).padStart(2, '0');
        const dataCompleta = `${ano}-${mesStr}-${diaStr}`;
        const temEvento = eventos[dataCompleta];
        const classeCss = temEvento ? 'evento' : '';
        diasHtml += `<div class="${classeCss}" onclick="cliqueDia('${dataCompleta}')"> ${dia} </div>`;
    }

    diasElm.innerHTML = diasHtml;
}
 
 
// CLICAR EM UM DIA
 
function cliqueDia(data) {
    if (eventos[data]) {
        eventosElm.innerHTML =
            `Evento em ${data}: ${eventos[data]}`;
 
    } else {
        const novoEvento = prompt(
            `Adicionar evento para ${data}:`
        );
 
        if (novoEvento) {
            eventos[data] = novoEvento;
            carregarCalendario();
 
            eventosElm.innerHTML =
                `Evento adicionado: ${novoEvento}`;
 
        }
 
    }
 
}
 
 
// MÊS ANTERIOR
 
document
    .getElementById('btn-anterior')
    .addEventListener('click', function () {
 
        mes--;
 
        if (mes < 0) {
 
            mes = 11;
 
            ano--;
 
        }
 
        carregarCalendario();
 
    });
 
 
// PRÓXIMO MÊS
 
document
    .getElementById('btn-proximo')
    .addEventListener('click', function () {
 
        mes++;
 
        if (mes > 11) {
 
            mes = 0;
 
            ano++;
 
        }
 
        carregarCalendario();
 
    });
 
 
// FECHAR CALENDÁRIO
 
const fechar = document.getElementById('fechar');
 
fechar.addEventListener('click', function () {
 
    document.querySelector('.calendar').style.display = 'none';
 
});
 
 
// INICIAR CALENDÁRIO
 
carregarCalendario();