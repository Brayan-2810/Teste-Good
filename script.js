const GAME_API_KEY = "dev_75dd01bbcd6e4c31a0cf7576d2d8f47e";
const API_DOMAIN_URL = "https://api.lootlocker.io";
const LEADERBOARD_KEY = "top_tempo";

const tabela = document.getElementById("placar-corpo");
const botao = document.getElementById("botao-atualizar");


async function carregarPlacar() {

    botao.disabled = true;
    botao.textContent = "⏳ Testando...";

    tabela.innerHTML = `
        <tr>
            <td colspan="3">
                ⏳ Conectando ao LootLocker...
            </td>
        </tr>
    `;

    try {

        // ==========================================
        // TESTE 1 - LOGIN GUEST
        // ==========================================

        console.log("=================================");
        console.log("TESTE 1: LOGIN GUEST");
        console.log("=================================");

        const loginResponse = await fetch(
            `${API_DOMAIN_URL}/game/v2/session/guest`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    game_key: GAME_API_KEY,
                    game_version: "1.0.0"
                })
            }
        );

        const loginText = await loginResponse.text();

        console.log(
            "Status:",
            loginResponse.status
        );

        console.log(
            "Resposta:",
            loginText
        );


        if (!loginResponse.ok) {

            throw new Error(
                `LOGIN GUEST FALHOU - HTTP ${loginResponse.status} - ${loginText}`
            );
        }


        const loginData =
            JSON.parse(loginText);

        const token =
            loginData.session_token;


        if (!token) {

            throw new Error(
                "LootLocker não enviou session_token."
            );
        }


        console.log(
            "✅ LOGIN GUEST FUNCIONOU!"
        );


        // ==========================================
        // TESTE 2 - LEADERBOARD
        // ==========================================

        console.log("=================================");
        console.log("TESTE 2: LEADERBOARD");
        console.log("=================================");

        const leaderboardURL =
            `${API_DOMAIN_URL}/game/leaderboards/` +
            `${encodeURIComponent(LEADERBOARD_KEY)}` +
            `/list?count=10`;


        console.log(
            "Leaderboard Key:",
            LEADERBOARD_KEY
        );

        console.log(
            "URL:",
            leaderboardURL
        );


        const leaderboardResponse =
            await fetch(
                leaderboardURL,
                {
                    method: "GET",

                    headers: {
                        "x-session-token": token
                    }
                }
            );


        const leaderboardText =
            await leaderboardResponse.text();


        console.log(
            "Status:",
            leaderboardResponse.status
        );

        console.log(
            "Resposta:",
            leaderboardText
        );


        if (!leaderboardResponse.ok) {

            throw new Error(
                `LEADERBOARD FALHOU - HTTP ${leaderboardResponse.status} - ${leaderboardText}`
            );
        }


        const leaderboardData =
            JSON.parse(leaderboardText);


        console.log(
            "✅ LEADERBOARD FUNCIONOU!"
        );

        console.log(
            "Dados:",
            leaderboardData
        );


        // ==========================================
        // MOSTRAR RESULTADOS
        // ==========================================

        if (
            !leaderboardData.items ||
            leaderboardData.items.length === 0
        ) {

            tabela.innerHTML = `
                <tr>
                    <td colspan="3">
                        🏆 Login funcionou, mas o leaderboard está vazio.
                    </td>
                </tr>
            `;

            return;
        }


        tabela.innerHTML = "";


        leaderboardData.items.forEach(
            (item, index) => {

                const jogador =
                    item.player?.name ||
                    "Jogador Anônimo";

                const rank =
                    item.rank ??
                    index + 1;

                const score =
                    Number(item.score);


                const minutos =
                    Math.floor(score / 60000);

                const segundos =
                    Math.floor(
                        (score % 60000) / 1000
                    );

                const milissegundos =
                    score % 1000;


                const tempo =
                    `${String(minutos).padStart(2, "0")}:` +
                    `${String(segundos).padStart(2, "0")}:` +
                    `${String(milissegundos).padStart(3, "0")}`;


                tabela.innerHTML += `
                    <tr>
                        <td>${rank}º</td>
                        <td>${jogador}</td>
                        <td class="tempo">${tempo}</td>
                    </tr>
                `;
            }
        );

    }

    catch (erro) {

        console.error(
            "================================="
        );

        console.error(
            "ERRO FINAL:"
        );

        console.error(erro);

        console.error(
            "================================="
        );


        tabela.innerHTML = `
            <tr>
                <td colspan="3" style="color:#ff5555;">
                    ❌ Erro ao carregar o placar.
                    <br><br>
                    Abra o Console do navegador
                    para ver o erro.
                </td>
            </tr>
        `;
    }

    finally {

        botao.disabled = false;
        botao.textContent = "🔄 Atualizar placar";
    }
}


botao.addEventListener(
    "click",
    carregarPlacar
);


carregarPlacar();









// // =====================================================
// // CONFIGURAÇÕES DO LOOTLOCKER
// // =====================================================

// // COLOQUE SUA GAME API KEY AQUI
// const GAME_API_KEY = "dev_75dd01bbcd6e4c31a0cf7576d2d8f47e";

// const API_DOMAIN_URL = "https://api.lootlocker.io";

// const LEADERBOARD_KEY = "top_tempo";



// // =====================================================
// // ELEMENTOS DO HTML
// // =====================================================

// const tabelaCorpo =
//     document.getElementById("placar-corpo");

// const botaoAtualizar =
//     document.getElementById("botao-atualizar");


// // =====================================================
// // FORMATAR TEMPO
// // =====================================================

// function formatarTempo(ms) {

//     ms = Number(ms);

//     if (isNaN(ms)) {
//         return "--:--:---";
//     }

//     const minutos =
//         Math.floor(ms / 60000);

//     const segundos =
//         Math.floor(
//             (ms % 60000) / 1000
//         );

//     const milissegundos =
//         ms % 1000;


//     return (
//         `${minutos.toString().padStart(2, "0")}:` +
//         `${segundos.toString().padStart(2, "0")}:` +
//         `${milissegundos.toString().padStart(3, "0")}`
//     );
// }


// // =====================================================
// // CRIAR SESSÃO GUEST
// // =====================================================

// async function criarSessao() {

//     console.log(
//         "LootLocker: criando sessão Guest..."
//     );


//     const resposta = await fetch(
//         `${API_DOMAIN_URL}/game/v2/session/guest`,
//         {
//             method: "POST",

//             headers: {
//                 "Content-Type": "application/json"
//             },

//             body: JSON.stringify({
//                 game_key: GAME_API_KEY
//             })
//         }
//     );


//     const texto =
//         await resposta.text();


//     console.log(
//         "Resposta da sessão:",
//         resposta.status,
//         texto
//     );


//     if (!resposta.ok) {

//         throw new Error(
//             `Erro ao criar sessão. HTTP ${resposta.status}`
//         );
//     }


//     let dados;

//     try {

//         dados = JSON.parse(texto);

//     } catch (erro) {

//         throw new Error(
//             "Resposta inválida do LootLocker."
//         );
//     }


//     if (!dados.session_token) {

//         console.error(
//             "Resposta recebida:",
//             dados
//         );

//         throw new Error(
//             "LootLocker não retornou o session_token."
//         );
//     }


//     console.log(
//         "LootLocker: sessão criada!"
//     );


//     return dados.session_token;
// }


// // =====================================================
// // BUSCAR TOP 10
// // =====================================================

// async function buscarLeaderboard(token) {

//     const url =
//         `${API_DOMAIN_URL}/game/leaderboards/` +
//         `${encodeURIComponent(LEADERBOARD_KEY)}` +
//         `/list?count=10`;


//     console.log(
//         "Buscando leaderboard:",
//         LEADERBOARD_KEY
//     );


//     console.log(
//         "URL:",
//         url
//     );


//     const resposta = await fetch(
//         url,
//         {
//             method: "GET",

//             headers: {
//                 "x-session-token": token
//             }
//         }
//     );


//     const texto =
//         await resposta.text();


//     console.log(
//         "Resposta do leaderboard:",
//         resposta.status,
//         texto
//     );


//     if (!resposta.ok) {

//         throw new Error(
//             `Erro ao buscar leaderboard. HTTP ${resposta.status}`
//         );
//     }


//     let dados;

//     try {

//         dados = JSON.parse(texto);

//     } catch (erro) {

//         throw new Error(
//             "Resposta inválida do leaderboard."
//         );
//     }


//     return dados;
// }


// // =====================================================
// // MOSTRAR PLACAR
// // =====================================================

// function mostrarPlacar(dados) {

//     tabelaCorpo.innerHTML = "";


//     // Não existem resultados

//     if (
//         !dados.items ||
//         dados.items.length === 0
//     ) {

//         tabelaCorpo.innerHTML = `
//             <tr>
//                 <td
//                     colspan="3"
//                     class="mensagem">
//                     🏆 Nenhum tempo registrado ainda!
//                 </td>
//             </tr>
//         `;

//         return;
//     }


//     // Criar cada linha

//     dados.items.forEach(
//         (item, index) => {

//             // Nome

//             const nomeJogador =
//                 item.player?.name ||
//                 "Jogador Anônimo";


//             // Posição

//             const posicao =
//                 item.rank ??
//                 (index + 1);


//             // Tempo

//             const tempo =
//                 formatarTempo(item.score);


//             // Criar linha

//             const linha =
//                 document.createElement("tr");


//             // -------------------------
//             // POSIÇÃO
//             // -------------------------

//             const colunaPosicao =
//                 document.createElement("td");

//             colunaPosicao.textContent =
//                 `${posicao}º`;


//             // -------------------------
//             // JOGADOR
//             // -------------------------

//             const colunaJogador =
//                 document.createElement("td");

//             colunaJogador.textContent =
//                 nomeJogador;


//             // -------------------------
//             // TEMPO
//             // -------------------------

//             const colunaTempo =
//                 document.createElement("td");

//             colunaTempo.textContent =
//                 tempo;

//             colunaTempo.className =
//                 "tempo";


//             // Adicionar colunas

//             linha.appendChild(
//                 colunaPosicao
//             );

//             linha.appendChild(
//                 colunaJogador
//             );

//             linha.appendChild(
//                 colunaTempo
//             );


//             // Adicionar linha à tabela

//             tabelaCorpo.appendChild(
//                 linha
//             );
//         }
//     );
// }


// // =====================================================
// // CARREGAR PLACAR
// // =====================================================

// async function carregarPlacar() {

//     try {

//         // Desabilita botão

//         botaoAtualizar.disabled = true;

//         botaoAtualizar.textContent =
//             "⏳ Carregando...";


//         // Mensagem

//         tabelaCorpo.innerHTML = `
//             <tr>
//                 <td
//                     colspan="3"
//                     class="mensagem">
//                     ⏳ Conectando ao LootLocker...
//                 </td>
//             </tr>
//         `;


//         // -------------------------
//         // 1. CRIAR SESSÃO
//         // -------------------------

//         const token =
//             await criarSessao();


//         // -------------------------
//         // 2. BUSCAR LEADERBOARD
//         // -------------------------

//         const dados =
//             await buscarLeaderboard(token);


//         console.log(
//             "Dados finais:",
//             dados
//         );


//         // -------------------------
//         // 3. MOSTRAR
//         // -------------------------

//         mostrarPlacar(dados);


//     } catch (erro) {

//         console.error(
//             "ERRO AO CARREGAR PLACAR:",
//             erro
//         );


//         tabelaCorpo.innerHTML = `
//             <tr>
//                 <td
//                     colspan="3"
//                     class="erro">
//                     ❌ Erro ao carregar o placar.
//                 </td>
//             </tr>
//         `;


//     } finally {

//         // Reativar botão

//         botaoAtualizar.disabled = false;

//         botaoAtualizar.textContent =
//             "🔄 Atualizar placar";
//     }
// }


// // =====================================================
// // BOTÃO ATUALIZAR
// // =====================================================

// botaoAtualizar.addEventListener(
//     "click",
//     carregarPlacar
// );


// // =====================================================
// // CARREGAR AUTOMATICAMENTE
// // =====================================================

// carregarPlacar();
