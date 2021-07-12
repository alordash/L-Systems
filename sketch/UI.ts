/// <reference path="constants.ts" />
abstract class UIControl {
    static allowedParametersTypes = [
        'number',
        'string',
        'boolean'
    ];

    static paramsFiller = `<b>Parameters</b><br />`;

    static InitRenderCheck() {
        var continueRenderingCheckbox = <HTMLInputElement>document.getElementById("ContinueRendering");
        continueRenderingCheckbox.checked = continueRendering;
        continueRenderingCheckbox.onchange = function () {
            continueRendering = continueRenderingCheckbox.checked;
        }
    }

    static InitSpawnMoving(canvas: HTMLElement) {
        canvas.onmousemove = (e) => {
            if (e.buttons) {
                SpawnPoint = new Point(e.offsetX, e.offsetY);
                SpawnTransform.pos = SpawnPoint;
                Update();
            }
        }
        canvas.onclick = () => {
            Update(undefined, true);
        }
    }

    static CreateNumberParameter(obj: object, key: string) {
        const params = document.getElementById('Params');
        params.innerHTML = `${params.innerHTML}<br/>${key} <input id="${key}range" type="range" min="0" class="rangeParam" max="20" step="0.01" value="10"><br />`
    }

    static CreateParametersPanel(system: object) {
        console.log('system :>> ', system);
        for (let [key, value] of Object.entries(system)) {
            console.log('key, value, type :>> ', key, value, typeof value);
            if (UIControl.allowedParametersTypes.includes(typeof value)) {
                console.log(`That is ok`);
            }
            if (typeof value == 'number') {
                UIControl.CreateNumberParameter(system, key);
            }
        }
    }
}