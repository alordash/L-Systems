abstract class UIControll {
    static Init() {
        var continueRenderingCheckbox = <HTMLInputElement>document.getElementById("ContinueRendering");
        continueRenderingCheckbox.checked = continueRendering;
        continueRenderingCheckbox.onchange = function () {
            continueRendering = continueRenderingCheckbox.checked;
        }
    }
}