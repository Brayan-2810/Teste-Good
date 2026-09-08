// =====================================================
// CONFIGURAÇÕES DO LOOTLOCKER
// =====================================================

// COLOQUE SUA GAME API KEY AQUI
const GAME_API_KEY = "dev_75dd01bbcd6e4c31a0cf7576d2d8f47e";

const API_DOMAIN_URL = "https://api.lootlocker.io";

const LEADERBOARD_KEY = "top_tempo";



// =====================================================
// ELEMENTOS DO HTML
// =====================================================

const tabelaCorpo =
    document.getElementById("placar-corpo");

const botaoAtualizar =
    document.getElementById("botao-atualizar");


// =====================================================
// FORMATAR TEMPO
// =====================================================

function formatarTempo(ms) {

    ms = Number(ms);

    if (isNaN(ms)) {
        return "--:--:---";
    }

    const minutos =
        Math.floor(ms / 60000);

    const segundos =
        Math.floor(
            (ms % 60000) / 1000
        );

    const milissegundos =
        ms % 1000;


    return (
        `${minutos.toString().padStart(2, "0")}:` +
        `${segundos.toString().padStart(2, "0")}:` +
        `${milissegundos.toString().padStart(3, "0")}`
    );
}


// =====================================================
// CRIAR SESSÃO GUEST
// =====================================================

async function criarSessao() {

    console.log(
        "LootLocker: criando sessão Guest..."
    );


    const resposta = await fetch(
        `${API_DOMAIN_URL}/game/v2/session/guest`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                game_key: GAME_API_KEY
            })
        }
    );


    const texto =
        await resposta.text();


    console.log(
        "Resposta da sessão:",
        resposta.status,
        texto
    );


    if (!resposta.ok) {

        throw new Error(
            `Erro ao criar sessão. HTTP ${resposta.status}`
        );
    }


    let dados;

    try {

        dados = JSON.parse(texto);

    } catch (erro) {

        throw new Error(
            "Resposta inválida do LootLocker."
        );
    }


    if (!dados.session_token) {

        console.error(
            "Resposta recebida:",
            dados
        );

        throw new Error(
            "LootLocker não retornou o session_token."
        );
    }


    console.log(
        "LootLocker: sessão criada!"
    );


    return dados.session_token;
}


// =====================================================
// BUSCAR TOP 10
// =====================================================

async function buscarLeaderboard(token) {

    const url =
        `${API_DOMAIN_URL}/game/leaderboards/` +
        `${encodeURIComponent(LEADERBOARD_KEY)}` +
        `/list?count=10`;


    console.log(
        "Buscando leaderboard:",
        LEADERBOARD_KEY
    );


    console.log(
        "URL:",
        url
    );


    const resposta = await fetch(
        url,
        {
            method: "GET",

            headers: {
                "x-session-token": token
            }
        }
    );


    const texto =
        await resposta.text();


    console.log(
        "Resposta do leaderboard:",
        resposta.status,
        texto
    );


    if (!resposta.ok) {

        throw new Error(
            `Erro ao buscar leaderboard. HTTP ${resposta.status}`
        );
    }


    let dados;

    try {

        dados = JSON.parse(texto);

    } catch (erro) {

        throw new Error(
            "Resposta inválida do leaderboard."
        );
    }


    return dados;
}


// =====================================================
// MOSTRAR PLACAR
// =====================================================

function mostrarPlacar(dados) {

    tabelaCorpo.innerHTML = "";


    // Não existem resultados

    if (
        !dados.items ||
        dados.items.length === 0
    ) {

        tabelaCorpo.innerHTML = `
            <tr>
                <td
                    colspan="3"
                    class="mensagem">
                    🏆 Nenhum tempo registrado ainda!
                </td>
            </tr>
        `;

        return;
    }


    // Criar cada linha

    dados.items.forEach(
        (item, index) => {

            // Nome

            const nomeJogador =
                item.player?.name ||
                "Jogador Anônimo";


            // Posição

            const posicao =
                item.rank ??
                (index + 1);


            // Tempo

            const tempo =
                formatarTempo(item.score);


            // Criar linha

            const linha =
                document.createElement("tr");


            // -------------------------
            // POSIÇÃO
            // -------------------------

            const colunaPosicao =
                document.createElement("td");

            colunaPosicao.textContent =
                `${posicao}º`;


            // -------------------------
            // JOGADOR
            // -------------------------

            const colunaJogador =
                document.createElement("td");

            colunaJogador.textContent =
                nomeJogador;


            // -------------------------
            // TEMPO
            // -------------------------

            const colunaTempo =
                document.createElement("td");

            colunaTempo.textContent =
                tempo;

            colunaTempo.className =
                "tempo";


            // Adicionar colunas

            linha.appendChild(
                colunaPosicao
            );

            linha.appendChild(
                colunaJogador
            );

            linha.appendChild(
                colunaTempo
            );


            // Adicionar linha à tabela

            tabelaCorpo.appendChild(
                linha
            );
        }
    );
}


// =====================================================
// CARREGAR PLACAR
// =====================================================

async function carregarPlacar() {

    try {

        // Desabilita botão

        botaoAtualizar.disabled = true;

        botaoAtualizar.textContent =
            "⏳ Carregando...";


        // Mensagem

        tabelaCorpo.innerHTML = `
            <tr>
                <td
                    colspan="3"
                    class="mensagem">
                    ⏳ Conectando ao LootLocker...
                </td>
            </tr>
        `;


        // -------------------------
        // 1. CRIAR SESSÃO
        // -------------------------

        const token =
            await criarSessao();


        // -------------------------
        // 2. BUSCAR LEADERBOARD
        // -------------------------

        const dados =
            await buscarLeaderboard(token);


        console.log(
            "Dados finais:",
            dados
        );


        // -------------------------
        // 3. MOSTRAR
        // -------------------------

        mostrarPlacar(dados);


    } catch (erro) {

        console.error(
            "ERRO AO CARREGAR PLACAR:",
            erro
        );


        tabelaCorpo.innerHTML = `
            <tr>
                <td
                    colspan="3"
                    class="erro">
                    ❌ Erro ao carregar o placar.
                </td>
            </tr>
        `;


    } finally {

        // Reativar botão

        botaoAtualizar.disabled = false;

        botaoAtualizar.textContent =
            "🔄 Atualizar placar";
    }
}


// =====================================================
// BOTÃO ATUALIZAR
// =====================================================

botaoAtualizar.addEventListener(
    "click",
    carregarPlacar
);


// =====================================================
// CARREGAR AUTOMATICAMENTE
// =====================================================

carregarPlacar();
