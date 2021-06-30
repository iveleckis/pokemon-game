export default class NavModal {
    constructor() {
        this.root = document.querySelector('#root');
    }

    renderModal() {
        const container = document.createElement('div');
        container.classList.add('container');
        container.id = 'container';
        this.root.appendChild(container);
        return document.querySelector('#container');
    }

    renderLanding() {
        const container = this.renderModal();

        container.appendChild(Button('start', 'startButton'));
        container.appendChild(Button('options', 'optionsButton'));
        container.appendChild(Button('about', 'aboutButton'));
    }
}

const Button = (text, id) => {
    const button = document.createElement('button');
    button.id = id;
    button.innerHTML = text;
    return button;
};
