// ABRIR AGENDA

const agendaLink = document.getElementById("agenda");
const calendario = document.querySelector(".calendar");

agendaLink.addEventListener("click", function (event) {
    event.preventDefault();
    calendario.style.display = "block";
});


// ELEMENTOS DO CALENDÁRIO

const mesAnoElm = document.getElementById("mes-ano");
const diasElm = document.getElementById("dias-calendario");
const eventosElm = document.getElementById("eventos");


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

const eventosCalendario = dados.reduce(function (acc, evento) {
    acc[evento.data] = evento["evento-novo"];
    return acc;
}, {});


// CARREGAR CALENDÁRIO

function carregarCalendario() {

    mesAnoElm.textContent = `${nomesMeses[mes]} de ${ano}`;

    const primeiroDiaIndex = new Date(ano, mes, 1).getDay();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    diasElm.innerHTML = "";

    // espaços antes do primeiro dia

    for (let i = 0; i < primeiroDiaIndex; i++) {
        const espaco = document.createElement("div");
        diasElm.appendChild(espaco);
    }

    // dias do mês

    for (let dia = 1; dia <= ultimoDia; dia++) {

        const diaStr = String(dia).padStart(2, "0");
        const mesStr = String(mes + 1).padStart(2, "0");

        const dataCompleta = `${ano}-${mesStr}-${diaStr}`;

        const diaElemento = document.createElement("div");

        diaElemento.textContent = dia;

        if (eventosCalendario[dataCompleta]) {
            diaElemento.classList.add("evento");
        }

        // clique no dia

        diaElemento.addEventListener("click", function () {
            cliqueDia(dataCompleta);
        });

        diasElm.appendChild(diaElemento);
    }
}


// CLICAR EM UM DIA

function cliqueDia(data) {

    if (eventosCalendario[data]) {

        eventosElm.textContent =
            `Evento em ${data}: ${eventosCalendario[data]}`;

    } else {

        const novoEvento = prompt(
            `Adicionar evento para ${data}:`
        );

        if (novoEvento) {

            eventosCalendario[data] = novoEvento;

            carregarCalendario();

            eventosElm.textContent =
                `Evento adicionado: ${novoEvento}`;
        }
    }
}


// MÊS ANTERIOR

const btnAnterior = document.getElementById("btn-anterior");

btnAnterior.addEventListener("click", function () {

    mes--;

    if (mes < 0) {
        mes = 11;
        ano--;
    }

    carregarCalendario();
});


// PRÓXIMO MÊS

const btnProximo = document.getElementById("btn-proximo");

btnProximo.addEventListener("click", function () {

    mes++;

    if (mes > 11) {
        mes = 0;
        ano++;
    }

    carregarCalendario();
});


// FECHAR CALENDÁRIO

const fechar = document.getElementById("fechar");

fechar.addEventListener("click", function () {

    calendario.style.display = "none";

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

    lista.forEach(function (e) {

        listaEventos.innerHTML += `
            <div class="banner-novo">
                <img src="${e.imagem}" alt="${e["evento-novo"]}">
                <h5 class="data">${e.data}</h5>
                <h5 class="hora">${e.hora}</h5>
                <h6 class="preco">${e.preco}</h6>
                <h2 class="evento-novo">${e["evento-novo"]}</h2>

                <button 
                    class="btn-saiba-mais"
                    data-id="${e.id}">
                    Saiba mais
                </button>

            </div>
        `;
    });
}


// PESQUISAR

function pesquisar() {

    const pesquisa = pesquisaInput.value.toLowerCase().trim();

    const eventosFiltrados = dados.filter(function (e) {

        return e["evento-novo"]
            .toLowerCase()
            .includes(pesquisa);

    });

    displayEventos(eventosFiltrados);
}

// CATEGORIAS DE EVENTOS

const select = document.getElementById("categorias");

select.addEventListener("change", function () {
    const categoriaSelecionada = select.value.toLowerCase();

    const eventosFiltrados = dados.filter(function (e) {
        return e.categoria.toLowerCase() === categoriaSelecionada;
    });

    displayEventos(eventosFiltrados);

});


// BOTÃO PESQUISAR

btnPesquisa.addEventListener("click", pesquisar);


// PESQUISA ENQUANTO DIGITA

pesquisaInput.addEventListener("input", pesquisar);


// MOSTRAR TODOS AO ABRIR

displayEventos(dados);


// CLICAR NO SAIBA MAIS

listaEventos.addEventListener("click", function(event) {

    if (event.target.classList.contains("btn-saiba-mais")) {

        const id = Number(event.target.dataset.id);
        const evento = dados.find(function(e) {
            return e.id === id;
        });

        mostrarDetalhes(evento);
    }

});


// MOSTRAR DETALHES

function mostrarDetalhes(evento) {

    document.getElementById("detalhes-titulo").textContent =
        evento["evento-novo"];

    document.getElementById("detalhes-imagem").src =
        evento.imagem;

    document.getElementById("detalhes-descricao").textContent =
        evento["detalhes"];

    document.getElementById("detalhes-data").textContent =
        evento.data;

    document.getElementById("detalhes-hora").textContent =
        evento.hora;

    document.getElementById("detalhes-preco").textContent =
        evento.preco;

    document.getElementById("detalhes-vagas").textContent =
        evento.vaga;

    document.getElementById("detalhes-evento").style.display =
        "block";
}

const btnFecharDetalhes =
    document.getElementById("btn-fechar-detalhes");

btnFecharDetalhes.addEventListener("click", function() {

    document.getElementById("detalhes-evento").style.display =
        "none";

});

