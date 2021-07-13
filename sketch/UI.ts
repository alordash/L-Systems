/// <reference path="constants.ts" />
/// <reference path="L_Systems/L_Systems_List.ts" />

let playTimer: NodeJS.Timer;
let playing = false;
let playStep = 50;

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
        if (key[0] == L_System.ignoreMark) {
            return;
        }
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
        for (let [key, value] of Object.entries(system)) {
            if (value instanceof NumberParam) {
                UIControl.CreateNumberParameter(system, key);
            }
        }
    }

    static UpdateEnergyRange(energyRange: HTMLInputElement) {
        let energy = lSystem.CountMaxEnergy(generation, SpawnTransform);
        energyRange.max = energy.toString();
        energyRange.step = (energy / 100).toString();
    }

    static InitTimeRange(lSystem: L_System) {
        let timeCheckbox = <HTMLInputElement>document.getElementById('TimeCheckbox');
        let energyDiv = document.getElementById('energydiv');
        let energyRange = <HTMLInputElement>document.getElementById('energyrange');
        UIControl.UpdateEnergyRange(energyRange);
        timeCheckbox.onchange = () => {
            energyDiv.style.visibility = timeCheckbox.checked ? '' : 'hidden';
            lSystem.$energy = timeCheckbox.checked ? lSystem.$energy : 0;
        }
        energyRange.onchange = () => {
            lSystem.$energy = +energyRange.value;
            Update(undefined, true);
        }
        energyRange.onmousemove = (e) => {
            if (e.buttons) {
                lSystem.$energy = +energyRange.value;
                Update();
            }
        }
        
        let playButton = <HTMLInputElement>document.getElementById('PlayButton');
        playButton.onclick = () => {
            playing = !playing;
            if(playing) {
                playButton.style.backgroundColor = "#d0451b";
                playButton.textContent = "Stop";
                energyRange.step = (playStep = +energyRange.max / 1000).toString();
                playTimer = setInterval(() => {
                    let maxVal = +energyRange.max;
                    let v = +energyRange.value + playStep;
                    if (v > maxVal || v < 0) {
                        v -= 2 * playStep;
                        playStep *= -1;
                    }
                    energyRange.value = v.toString();
                    lSystem.$energy = v;
                    Update();
                }, 10);
            } else {
                playButton.style.backgroundColor = "#32d01b";
                playButton.textContent = "Play";
                clearInterval(playTimer);
            }
        }
    }

    static Init(lSystem: L_System) {
        UIControl.InitRandomizeButton();
        UIControl.CreateParametersPanel(lSystem);
        UIControl.CreateOptions();
        UIControl.InitTimeRange(lSystem);
    }
}