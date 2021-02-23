const build_btn = (id, text, className) => {
    return `<div class="relative w-full ${className}"><button class="btn" id="${id}">${text}</button></div>`;
};

const landing_html = `<div class="flex justify-center items-center direction-column w-1/2 app-w-max panel">
                        <div class="panel-title">pokemon game</div>
                        <button class="btn animate-btn-pulse" id="btn_start">start</button>
                        ${build_btn('btn_about', 'about', 'mt-3')}
                    </div>`;

const difficulty_html = `<div class="flex justify-center items-center direction-column w-1/2 app-w-max panel">
                            <div class="panel-title">Difficulty</div>
                            ${build_btn('btn_easy', 'easy', 'm-2')}
                            ${build_btn('btn_medium', 'medium', 'm-2')}
                            ${build_btn('btn_hard', 'hard', 'm-2')}
                            <div id="start_container" class="m-3"></div>
                            ${build_btn('btn_back', 'back', 'm-2 mt-3')}
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
                        ${build_btn('btn_back', 'back', 'm-2 mt-3')}
                    </div>`;

const loss_html = (pokemon_name) => {
    return `
            <div>
                <h1>You have lost :/</h1>
                <h3 class="flex justify-center">${pokemon_name}</h3>
                <div class="flex justify-center">Score: 123</div>
                <div class="flex justify-center pt">
                    <button>play again</button>
                </div>
            </div>
        `;
};
