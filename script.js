document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById('grid');
    const colorPicker = document.getElementById('colorPicker');
    const brushSize = document.getElementById('brushSize');
    const brushShape = document.getElementById('brushShape');
    const cursorOverlay = document.getElementById('cursorOverlay');
    let drawing = false;
    let typing = false;
    let textBox = null;
    let textTimer = null;

    const createTextBox = (size) => {
        const box = document.createElement('div');
        box.contentEditable = true;
        box.className = 'textbox';
        box.style.minWidth = `${2 * size}px`;
        box.style.minHeight = `${2 * size}px`;
        box.style.lineHeight = `${2 * size}px`;
        grid.appendChild(box);
        box.focus(); // automatically focus on the text box to allow typing
        return box;
    };

    const placeTextBox = () => {
        if (textBox) {
            textBox.style.pointerEvents = 'auto'; // make it so you can type once placed
            textBox = null;
            typing = false;
            textTimer = setTimeout(() => {
                drawing = false;
            }, 500);
        }
    };

    grid.addEventListener('mousedown', () => {
        if (!typing) {
            drawing = true;
            clearTimeout(textTimer);
        } else {
            placeTextBox();
        }
    });

    grid.addEventListener('mouseup', () => {
        drawing = false;
    });

    grid.addEventListener('mouseleave', () => {
        drawing = false;
    });

    grid.addEventListener('mousemove', (e) => {
        const rect = grid.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const size = parseInt(brushSize.value);
        const shape = brushShape.value;

        if (textBox) {
            textBox.style.left = `${x}px`;
            textBox.style.top = `${y}px`;
        }

        cursorOverlay.style.width = `${size}px`;
        cursorOverlay.style.height = `${size}px`;
        cursorOverlay.style.left = `${x - size / 2}px`;
        cursorOverlay.style.top = `${y - size / 2}px`;
        cursorOverlay.style.borderRadius = shape === 'circle' ? '50%' : '0';

        if (drawing && !typing) {
            const pixel = document.createElement('div');
            pixel.style.position = 'absolute';
            pixel.style.width = `${size}px`;
            pixel.style.height = `${size}px`;
            pixel.style.left = `${x - size / 2}px`;
            pixel.style.top = `${y - size / 2}px`;
            pixel.style.backgroundColor = colorPicker.value;
            pixel.style.borderRadius = shape === 'circle' ? '50%' : '0';

            grid.appendChild(pixel);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!textBox) {
            const size = parseInt(brushSize.value);
            textBox = createTextBox(size);
            typing = true;
        }
    });
});
