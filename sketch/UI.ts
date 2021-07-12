/// <reference path="constants.ts" />
abstract class UIControl {
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
            Update();
        }
    }
}