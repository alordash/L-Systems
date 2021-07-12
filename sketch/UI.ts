/// <reference path="constants.ts" />

abstract class UIControl {
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
                Update(undefined, undefined, true);
            }
        }
        canvas.onclick = () => {
            Update(undefined, true);
        }
    }

    static RangeFormat(key: string) {
        return `${key}range`;
    }

    static CreateNumberParameter(obj: L_System, key: string) {
        if(key[0] == L_System.propertyMark) {
            key = key.substring(1);
        }
        const params = document.getElementById('Params');

        params.appendChild(document.createElement('br'));
        params.appendChild(document.createTextNode(key));

        let range = document.createElement("input");
        range.id = UIControl.RangeFormat(key);
        range.type = 'range'; range.min = '0'; range.className = 'rangeParam'; range.max = '40'; range.step = 'any'; range.value = `${obj[key]}`;
        range.onchange = () => {
            console.log(`For ${key}`);
            obj[key] = +range.value;
            Update(undefined, true);
        }
        range.onmousemove = (e) => {
            if (e.buttons) {
                obj[key] = +range.value;
                Update();
            }
        }
        params.appendChild(range);
    }

    static CreateParametersPanel(system: L_System) {
        console.log('system :>> ', system);
        for (let [key, value] of Object.entries(system)) {
            console.log('key, value, type :>> ', key, value, typeof value);
            if (typeof value == 'number') {
                UIControl.CreateNumberParameter(system, key);
            }
        }
    }
}