import SceneManager from './setup/SceneManager';

export default (container, config) => {
    const canvas = createCanvas(document, container);
    const sceneManager = new SceneManager(canvas, config);

    let canvasHalfWidth;
    let canvasHalfHeight;

    bindEventListeners();
    render();

    function createCanvas(document, c) {
        const newCanvas = document.createElement('canvas');
        c.appendChild(newCanvas);
        return newCanvas;
    }

    function bindEventListeners() {
        window.onresize = resizeCanvas;
        window.onmousemove = mouseMove;
        resizeCanvas();
    }

    function resizeCanvas() {
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        canvasHalfWidth = Math.round(canvas.offsetWidth / 2);
        canvasHalfHeight = Math.round(canvas.offsetHeight / 2);

        sceneManager.onWindowResize();
    }

    function mouseMove({ screenX, screenY }) {
        sceneManager.onMouseMove(screenX - canvasHalfWidth, screenY - canvasHalfHeight);
    }

    function render(time) {
        requestAnimationFrame(render);
        sceneManager.update(time);
    }

    function cleanup() {
        sceneManager.cleanup();
    }

    function updateTweets(tweets) {
        sceneManager.updateTweets(tweets);
    }

    return {
        cleanup,
        updateTweets
    };
};
