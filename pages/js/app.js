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

// EVENTOS DO CALENDÁRIO

const eventosCalendario = {
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
        const temEvento = eventosCalendario[dataCompleta];
        const classeCss = temEvento ? 'evento' : '';

        diasHtml += `
            <div class="${classeCss}" onclick="cliqueDia('${dataCompleta}')"> ${dia} </div>
        `;
    }

    diasElm.innerHTML = diasHtml;
}

// CLICAR EM UM DIA

function cliqueDia(data) {

    if (eventosCalendario[data]) {

        eventosElm.innerHTML =
            `Evento em ${data}: ${eventosCalendario[data]}`;

    } else {

        const novoEvento = prompt(
            `Adicionar evento para ${data}:`
        );

        if (novoEvento) {
            eventosCalendario[data] = novoEvento;
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


// PESQUISA DE EVENTOS
const listaEventos = document.getElementById("lista-eventos");
const pesquisaInput = document.getElementById("pesquisa");
const btnPesquisa = document.getElementById("btn-pesquisa");


// MOSTRAR EVENTOS
function displayEventos(lista) {

    listaEventos.innerHTML = "";

    if (lista.length === 0) {

        listaEventos.innerHTML =
            "<p>Nenhum evento encontrado.</p>";
        return;
    }

    lista.forEach(e => {

        listaEventos.innerHTML += `
            <div class="banner-novo">
                <h5 class="data">${e.data}</h5>
                <h5 class="hora">${e.hora}</h5>
                <h6 class="preco">${e.preco}</h6>
                <h2 class="evento-novo">${e["evento-novo"]}</h2>
            </div>
        `;
    });
}

// PESQUISAR

function pesquisar() {

    const pesquisa =
        pesquisaInput.value.toLowerCase().trim();

    const eventosFiltrados = dados.filter(e =>
        e["evento-novo"]
            .toLowerCase()
            .includes(pesquisa)
    );

    displayEventos(eventosFiltrados);
}

// BOTÃO PESQUISAR

btnPesquisa.addEventListener(
    "click",
    pesquisar
);

// PESQUISA ENQUANTO DIGITA

pesquisaInput.addEventListener(
    "input",
    pesquisar
);

// MOSTRAR TODOS AO ABRIR

displayEventos(dados);
