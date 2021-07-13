/// <reference path="constants.ts" />
/// <reference path="L_Systems/L_Systems_List.ts" />

abstract class UIControl {
    static paramsFiller = `<b>Parameters</b><br />`;

    static InitSpawnMoving(canvas: HTMLElement) {
        canvas.onmousemove = (e) => {
            if (e.buttons) {
                SpawnPoint = new Point(e.offsetX, e.offsetY);
                SpawnTransform.pos = SpawnPoint;
                Update(undefined, undefined, true);
            }
        }
    }

    static InitRandomizeButton() {
        document.getElementById("Randomize").onclick = () => {
            Update(undefined, true, undefined, true);
        }
    }

    static CreateOptions() {
        let list = document.createElement('select');
        list.className = 'options';
        for (let system of L_Systems_List) {
            let option = document.createElement('option');
            option.innerHTML = system.name;
            list.appendChild(option);
        }

        list.onchange = () => {
            let system = L_Systems_List.find((x) => { return x.name == list.value; });
            console.log('system.name :>> ', system.name);
            lSystem = new system();
            lSystem.reset(SpawnTransform);
            UIControl.CreateParametersPanel(lSystem);
            Update(true, true);
            _Draw();
        }

        let editor = document.getElementById('Editor');
        document.body.insertBefore(list, editor);
    }

    static RangeFormat(key: string) {
        return `${key}range`;
    }

    static CreateNumberParameter(obj: L_System, key: string) {
        let isProperty = key[0] == L_System.propertyMark;
        if (isProperty) {
            key = key.substring(1);
        }
        let value = obj[key];

        const params = document.getElementById('Params');

        params.appendChild(document.createElement('br'));
        params.appendChild(document.createTextNode(key));

        let range = document.createElement("input");
        range.id = UIControl.RangeFormat(key);
        range.type = 'range';
        range.className = 'rangeParam';
        range.min = `${value.min}`;
        range.max = `${value.max}`;
        range.step = '0.1';
        range.value = `${isProperty ? obj[key] : obj[key].v}`;

        range.onchange = () => {
            if (isProperty) {
                obj[key] = +range.value;
            } else {
                obj[key].v = +range.value;
            }
            Update(undefined, true);
        }
        range.onmousemove = (e) => {
            if (e.buttons) {
                if (isProperty) {
                    obj[key] = +range.value;
                } else {
                    obj[key].v = +range.value;
                }
                Update();
            }
        }
        params.appendChild(range);
    }

    static CreateParametersPanel(system: L_System) {
        let ranges = Array.from(document.getElementById('Params').childNodes.values()).filter(x => {
            return (<HTMLElement>x).className == 'rangeParam';
        });
        for (let range of ranges) {
            range.remove();
        }
        document.getElementById('Params').innerHTML = `<b>Parameters</b>`;
        console.log('system :>> ', system);
        for (let [key, value] of Object.entries(system)) {
            console.log('key, value, type :>> ', key, value, typeof value);
            if (value instanceof NumberParam) {
                UIControl.CreateNumberParameter(system, key);
            }
        }
    }

    static Init(lSystem: L_System) {
        UIControl.InitRandomizeButton();
        UIControl.CreateParametersPanel(lSystem);
        UIControl.CreateOptions();
    }
}