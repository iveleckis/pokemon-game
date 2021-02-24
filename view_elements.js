const btn_html = (id, text, className) => {
    return `<div class="relative w-full ${className}"><button class="btn" id="${id}">${text}</button></div>`;
};

const landing_html = `<div class="flex justify-center items-center direction-column w-1/2 app-w-max panel">
                        <div class="panel-title">pokemon game</div>
                        <button class="btn animate-btn-pulse" id="btn_start">start</button>
                        ${btn_html('btn_about', 'about', 'mt-3')}
                    </div>`;

const difficulty_html = `<div class="flex justify-center items-center direction-column w-1/2 app-w-max panel">
                            <div class="panel-title">Difficulty</div>
                            ${btn_html('btn_easy', 'easy', 'm-2')}
                            ${btn_html('btn_medium', 'medium', 'm-2')}
                            ${btn_html('btn_hard', 'hard', 'm-2')}
                            <div id="start_container" class="m-3"></div>
                            ${btn_html('btn_back', 'back', 'm-2 mt-3')}
                        </div>`;

const about_html = `<div class="w-1/2 app-w-max panel">
                        <div class="panel-title">About...</div>
                        <div class="m-2">
                            <div>
                                Your goal is to guess as many pokemon names as possible.
                            </div>
                            <p>
                                You will lose if you run out of time or health.
                            </p>
                            <p>
                                You will get 1 or more points for each letter guessed, depending on difficulty you choose.
                            </p>
                        </div>
                        ${btn_html('btn_back', 'back', 'm-2 mt-3')}
                    </div>`;

const loss_html = (pokemon_name, score) => {
    return `
            <div class="panel">
                <div class="panel-title">You have lost :/</div>
                <h3 class="flex justify-center">You didn't guess <span class="text-red ml-3">${pokemon_name}</span></h3>
                <div class="flex justify-center">Score: ${score}</div>
                <div class="flex justify-center pt">
                    ${btn_html('play_again', 'Play again', 'm-3')}
                </div>
            </div>
        `;
};

const game_html = (
    score,
    timer,
    health,
    pokemon_image,
    slots_html,
    matrix_html
) => {
    return `
            <div class="panel">
                <div class="flex justify-between p-2 w-full">
                    <div>Score:<span id="score_count">${score}</span></div>
                    <div id="timer">${timer}</div>
                </div>
                <div class="flex justify-center items-center p-2">
                    <img class="square-10" src="${pokemon_image}" alt="x"/>
                </div>
                <div id="slots" class="flex justify-center p-1">${slots_html}</div>
                <div class="flex justify-center">
                    <div class="matrix-grid p-2" id="letter_matrix">${matrix_html}</div>
                </div>
                <div class="flex justify-center p-2" id="health">Health: ${health}</div>
            </div>
            `;
};
