const btn_html = (id, text, className) => {
    return `<div class="relative w-full ${className}"><button class="btn" id="${id}">${text}</button></div>`;
};

const landing_html = `<div class="flex justify-center items-center direction-column w-1/2 app-w-max panel">
                        <div class="panel-title">
                            pokemon game
                        </div>
                        ${btn_html('btn_start', 'start', 'mt-3')}
                        ${btn_html('btn_about', 'about', 'mt-3')}
                    </div>`;

const difficulty_html = `<div class="flex justify-center items-center direction-column w-1/2 app-w-max panel">
                            <div class="panel-title">
                                Difficulty
                            </div>
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
                <div class="panel-title">
                    You have lost :/
                </div>
                <h3 class="flex justify-center">
                    You didn't guess
                    <span class="text-red ml-3">
                        ${pokemon_name}
                    </span>
                </h3>
                <div class="flex justify-center">
                    Score: ${score}
                </div>
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
                    <div>
                        Score:
                        <span class="relative" id="score_value_container">
                            <span id="score_value">
                                ${score}
                            </span>
                        </span>
                    </div>
                    <div id="timer_container">
                        <span class="relative" id="timer_value_container">
                            <span id="timer_value">
                                ${timer}
                            </span>
                        </span>
                    </div>
                </div>
                <div class="flex justify-center items-center p-2">
                    <img class="square-10" src="${pokemon_image}" alt="x"/>
                </div>
                <div id="slots" class="flex justify-center p-1">
                    ${slots_html}
                </div>
                <div class="flex justify-center">
                    <div class="matrix-grid p-2" id="letter_matrix">
                        ${matrix_html}
                    </div>
                </div>
                <div class="flex justify-center p-3 mt-2" id="health">
                    Health:
                    <span class="relative" id="health_value_container">
                        <span id="health_value">
                            ${health}
                        </span>
                    </span>
                </div>
            </div>
            `;
};

const text_after_difficulty_html = (health, difficulty_level) => {
    return `<div class="p-2 text-center">
                You will start your game with
                <span class="text-red">
                    ${health}
                </span>
                health and each letter guessed will give you
                <span class="text-red">
                    ${difficulty_level} point${
        difficulty_level > 1 ? 's' : ''
    }</span>
            </div>`;
};

const toaster_html = (text, subtext) => {
    const toaster = document.createElement('toaster');
    toaster.setAttribute('id', 'toaster');
    toaster.className =
        'absolute right-0 top-0 m-3 toaster animate-show_toaster';
    const toaster_title = document.createElement('div');
    toaster_title.className = 'font-bold';
    toaster_title.innerHTML = text;
    const toaster_subtext = document.createElement('div');
    toaster_subtext.className = 'text-sm text-brown mt-2';
    toaster_subtext.innerHTML = subtext;
    toaster.appendChild(toaster_title);
    toaster.appendChild(toaster_subtext);
    return toaster;
};

const add_score_animtaion_html = (what_to_animate) => {
    const animation_container = document.createElement('div');
    animation_container.className =
        'absolute top-0 right-0 animate-plus_number_up text-red opacity-0';
    animation_container.innerHTML = what_to_animate;
    const random_id = Math.floor(Math.random() * 9999);
    animation_container.setAttribute('id', `animation_${random_id}`);
    return { html: animation_container, html_id: `animation_${random_id}` };
};

const loading_html = () => {
    return `
        <div class="loading_container">
            <div class="loading_inner_tow_colored_ball">
                <div class="loading_inner_block">
                    <div class="loading_inner_block_ball"></div>
                </div>
            </div>
        </div>
    `;
};
