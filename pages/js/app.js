// ==================== CALENDÁRIO ====================

const agendaLink = document.getElementById("agenda");
const calendario = document.querySelector(".calendar");
const fechar = document.getElementById("fechar");

agendaLink.addEventListener("click", function (event) {
    event.preventDefault();
    calendario.style.display = "block";
});

fechar.addEventListener("click", function () {
    calendario.style.display = "none";
});

const mesAnoElm = document.getElementById("mes-ano");
const diasElm = document.getElementById("dias-calendario");
const eventosElm = document.getElementById("eventos");

const btnAnterior = document.getElementById("btn-anterior");
const btnProximo = document.getElementById("btn-proximo");

const dataAtual = new Date();
let ano = dataAtual.getFullYear();
let mes = dataAtual.getMonth();

const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// junta os eventos do dados.js num objeto { "2026-09-17": "Cinema" }
const eventosCalendario = dados.reduce(function (acc, evento) {
    acc[evento.data] = evento["evento-novo"];
    return acc;
}, {});


function carregarCalendario() {

    mesAnoElm.textContent = nomesMeses[mes] + " de " + ano;

    const primeiroDiaIndex = new Date(ano, mes, 1).getDay();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    diasElm.innerHTML = "";

    for (let i = 0; i < primeiroDiaIndex; i++) {
        const espaco = document.createElement("div");
        diasElm.appendChild(espaco);
    }

    for (let dia = 1; dia <= ultimoDia; dia++) {

        const diaStr = String(dia).padStart(2, "0");
        const mesStr = String(mes + 1).padStart(2, "0");
        const dataCompleta = ano + "-" + mesStr + "-" + diaStr;

        const diaElemento = document.createElement("div");
        diaElemento.textContent = dia;

        if (eventosCalendario[dataCompleta]) {
            diaElemento.classList.add("evento");
        }

        diaElemento.addEventListener("click", function () {
            cliqueDia(dataCompleta);
        });

        diasElm.appendChild(diaElemento);
    }
}


function cliqueDia(data) {

    if (eventosCalendario[data]) {
        eventosElm.innerHTML = "Evento em " + data + ": " + eventosCalendario[data];
        return;
    }

    const novoEvento = prompt("Adicionar evento para " + data + ":");

    if (novoEvento) {
        eventosCalendario[data] = novoEvento;
        carregarCalendario();
        eventosElm.textContent = "Evento adicionado: " + novoEvento;
    }
}


btnAnterior.addEventListener("click", function () {
    mes--;
    if (mes < 0) {
        mes = 11;
        ano--;
    }
    carregarCalendario();
});

btnProximo.addEventListener("click", function () {
    mes++;
    if (mes > 11) {
        mes = 0;
        ano++;
    }
    carregarCalendario();
});

carregarCalendario();


// ==================== RESERVAS - FUNÇÕES ====================

const CHAVE_RESERVAS = "reservasViva";

function obterReservas() {
    const salvo = localStorage.getItem(CHAVE_RESERVAS);
    if (salvo) {
        return JSON.parse(salvo);
    }
    return [];
}

function salvarReservas(lista) {
    localStorage.setItem(CHAVE_RESERVAS, JSON.stringify(lista));
}

function ingressosReservados(eventoId) {
    const reservas = obterReservas();
    let total = 0;

    reservas.forEach(function (r) {
        if (r.eventoId === eventoId) {
            total += Number(r.ingressos);
        }
    });

    return total;
}

function vagasRestantes(evento) {
    if (typeof evento.vaga !== "number") {
        return null;
    }
    return evento.vaga - ingressosReservados(evento.id);
}

function gerarCodigoIngresso() {
    return "VA-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}


// ==================== LISTAGEM, PESQUISA E FILTROS ====================

const listaEventos = document.getElementById("lista-eventos");
const pesquisaInput = document.getElementById("pesquisa");
const btnPesquisa = document.getElementById("btn-pesquisa");
const categoriaSelect = document.getElementById("categorias");
const dataInput = document.getElementById("data");


function displayEventos(lista) {

    listaEventos.innerHTML = "";

    if (lista.length === 0) {
        listaEventos.innerHTML = "<p style='color: #fff;'>Nenhum evento encontrado.</p>";
        return;
    }

    lista.forEach(function (e) {

        const restantes = vagasRestantes(e);
        let avisoLotado = "";

        if (restantes !== null && restantes <= 0) {
            avisoLotado = "<span class='lotado'>LOTADO</span>";
        }

        listaEventos.innerHTML += `
            <div class="banner-novo">
                <img src="${e.imagem}" alt="${e["evento-novo"]}">
                <h5 class="data">${e.data}</h5>
                <h5 class="hora">${e.hora}</h5>
                <h6 class="preco">${e.preco}</h6>
                <h2 class="evento-novo">${e["evento-novo"]}</h2>
                ${avisoLotado}
                <button class="btn-saiba-mais" data-id="${e.id}">
                    Saiba mais
                </button>
            </div>
        `;
    });
}


// pesquisa por texto + categoria + data, tudo junto
function aplicarFiltros() {

    const texto = pesquisaInput.value.toLowerCase().trim();
    const categoria = categoriaSelect.value;
    const dataEscolhida = dataInput.value;

    const resultado = dados.filter(function (e) {

        const bateTexto = e["evento-novo"].toLowerCase().includes(texto);

        let bateCategoria = true;
        if (categoria && categoria !== "Todas" && categoria !== "Categorias") {
            bateCategoria = e.categoria === categoria;
        }

        let bateData = true;
        if (dataEscolhida) {
            bateData = e.data === dataEscolhida;
        }

        return bateTexto && bateCategoria && bateData;
    });

    displayEventos(resultado);
}


if (listaEventos) {

    if (btnPesquisa) {
        btnPesquisa.addEventListener("click", aplicarFiltros);
    }

    if (pesquisaInput) {
        pesquisaInput.addEventListener("input", aplicarFiltros);
    }

    if (categoriaSelect) {
        categoriaSelect.addEventListener("change", function () {

            if (categoriaSelect.value === "Todas") {
                if (dataInput) {
                    dataInput.value = "";
                }
                if (pesquisaInput) {
                    pesquisaInput.value = "";
                }
            }

            aplicarFiltros();
        });
    }

    if (dataInput) {
        dataInput.addEventListener("change", aplicarFiltros);
    }

    displayEventos(dados);

    listaEventos.addEventListener("click", function (event) {

        if (event.target.classList.contains("btn-saiba-mais")) {

            const id = Number(event.target.dataset.id);
            const evento = dados.find(function (e) {
                return e.id === id;
            });

            mostrarDetalhes(evento);
        }
    });
}


// ==================== DETALHES DO EVENTO ====================

let eventoAtual = null;

function mostrarDetalhes(evento) {

    eventoAtual = evento;

    document.getElementById("detalhes-titulo").textContent = evento["evento-novo"];
    document.getElementById("detalhes-imagem").src = evento.imagem;
    document.getElementById("detalhes-descricao").textContent = evento.detalhes;
    document.getElementById("detalhes-data").textContent = evento.data;
    document.getElementById("detalhes-hora").textContent = evento.hora;
    document.getElementById("detalhes-preco").textContent = evento.preco;

    const restantes = vagasRestantes(evento);
    let lotado = false;

    if (restantes !== null && restantes <= 0) {
        lotado = true;
    }

    if (restantes === null) {
        document.getElementById("detalhes-vagas").textContent = evento.vaga;
    } else {
        document.getElementById("detalhes-vagas").textContent = restantes;
    }

    document.getElementById("detalhes-lotado").hidden = !lotado;

    const inputQuantidade = document.getElementById("quantidade-ingressos");

    if (lotado) {
        inputQuantidade.value = 0;
        inputQuantidade.disabled = true;
    } else {
        inputQuantidade.value = 1;
        inputQuantidade.disabled = false;
    }

    if (restantes !== null) {
        inputQuantidade.max = Math.max(0, restantes);
    }

    const favorito = document.getElementById("btn-favorito");
    favorito.dataset.id = evento.id;
    favorito.checked = verificarFavorito(evento.id);

    const btnReservar = document.getElementById("btn-reservar");
    btnReservar.disabled = lotado;

    document.getElementById("detalhes-evento").style.display = "block";
}


const btnFecharDetalhes = document.getElementById("btn-fechar-detalhes");

if (btnFecharDetalhes) {
    btnFecharDetalhes.addEventListener("click", function () {
        document.getElementById("detalhes-evento").style.display = "none";
    });
}


// ==================== FAVORITOS ====================

let favoritos = [];

const favoritosSalvos = localStorage.getItem("favoritos");
if (favoritosSalvos) {
    favoritos = JSON.parse(favoritosSalvos);
}

function salvarFavoritos() {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function verificarFavorito(id) {
    return favoritos.includes(id);
}

function favoritar(id) {
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(function (f) {
            return f !== id;
        });
    } else {
        favoritos.push(id);
    }
    salvarFavoritos();
}

const btnFavorito = document.getElementById("btn-favorito");

if (btnFavorito) {
    btnFavorito.addEventListener("change", function () {
        favoritar(Number(this.dataset.id));
    });
}


// ==================== PÁGINA DE FAVORITOS ====================

const listaFavoritos = document.getElementById("lista-favoritos");

if (listaFavoritos) {

    const eventosFavoritos = dados.filter(function (e) {
        return favoritos.includes(e.id);
    });

    if (eventosFavoritos.length === 0) {
        listaFavoritos.innerHTML = "<p>Nenhum evento favoritado.</p>";
    } else {

        eventosFavoritos.forEach(function (e) {
            listaFavoritos.innerHTML += `
                <div class="banner-novo">
                    <img src="${e.imagem}" alt="${e["evento-novo"]}">
                    <h5>${e.data}</h5>
                    <h5>${e.hora}</h5>
                    <h6>${e.preco}</h6>
                    <h2>${e["evento-novo"]}</h2>
                </div>
            `;
        });
    }
}


// ==================== RESERVAR ====================

const btnReservar = document.getElementById("btn-reservar");

if (btnReservar) {

    btnReservar.addEventListener("click", function () {

        if (!eventoAtual) {
            return;
        }

        const quantidade = Number(document.getElementById("quantidade-ingressos").value);
        const restantes = vagasRestantes(eventoAtual);

        if (!quantidade || quantidade < 1) {
            alert("Escolha ao menos 1 ingresso.");
            return;
        }

        if (restantes !== null && quantidade > restantes) {
            alert("Só restam " + restantes + " vaga(s) para este evento.");
            return;
        }

        const reserva = {
            id: Date.now(),
            eventoId: eventoAtual.id,
            evento: eventoAtual["evento-novo"],
            data: eventoAtual.data,
            hora: eventoAtual.hora,
            local: eventoAtual.local,
            imagem: eventoAtual.imagem,
            ingressos: quantidade,
            codigo: gerarCodigoIngresso()
        };

        const reservas = obterReservas();
        reservas.push(reserva);
        salvarReservas(reservas);

        alert(
            "Reserva confirmada!\n\n" +
            eventoAtual["evento-novo"] + " — " + quantidade + " ingresso(s)\n" +
            "Código: " + reserva.codigo
        );

        mostrarDetalhes(eventoAtual);
        displayEventos(dados);
    });
}


// ==================== MINHAS RESERVAS ====================

const listaMinhasReservas = document.getElementById("lista-minhas-reservas");

if (listaMinhasReservas) {
    renderizarMinhasReservas();

    listaMinhasReservas.addEventListener("click", function (event) {

        if (!event.target.classList.contains("btn-cancelar")) {
            return;
        }

        const id = Number(event.target.dataset.reservaId);

        const reservas = obterReservas().filter(function (r) {
            return r.id !== id;
        });

        salvarReservas(reservas);
        renderizarMinhasReservas();
    });
}

function renderizarMinhasReservas() {

    const reservas = obterReservas();

    if (reservas.length === 0) {
        listaMinhasReservas.innerHTML = "<p class='sem-reservas'>Você ainda não fez nenhuma reserva.</p>";
        return;
    }

    listaMinhasReservas.innerHTML = "";

    reservas.forEach(function (r) {

        const qrSrc = "https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=" + encodeURIComponent(r.codigo);

        listaMinhasReservas.innerHTML += `
            <div class="reserva" data-reserva-id="${r.id}">
                <div class="PNG-reserva">
                    <img src="${r.imagem}" alt="${r.evento}">
                </div>
                <section class="informacoes-reserva">
                    <div class="titulo-evento">
                        <h2>${r.evento}</h2>
                    </div>
                    <div class="informacoes">
                        <p><i class="fa-regular fa-calendar-days"></i> Data: ${r.data}</p>
                        <p><i class="fa-regular fa-clock"></i> Hora: ${r.hora || "A definir"}</p>
                        <p><i class="fa-solid fa-map-location-dot"></i> Local: ${r.local || "A definir"}</p>
                        <p><i class="fa-solid fa-ticket"></i> Quantidade de ingressos: ${r.ingressos}</p>
                        <div class="ingresso-codigo">
                            <img class="qr-ingresso" src="${qrSrc}" alt="QR code do ingresso">
                            <span class="codigo-ingresso">Código: ${r.codigo}</span>
                        </div>
                        <span>Reservado com sucesso!</span>
                        <label>
                            <button type="button" class="btn-cancelar" data-reserva-id="${r.id}">
                                Cancelar reserva
                            </button>
                        </label>
                    </div>
                </section>
            </div>
        `;
    });
}