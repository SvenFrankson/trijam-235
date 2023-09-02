/// <reference path="../lib/babylon.d.ts"/>
class Game {
    constructor(canvasElement) {
        Game.Instance = this;
        this.canvas = document.getElementById(canvasElement);
        this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.msRequestPointerLock || this.canvas.mozRequestPointerLock || this.canvas.webkitRequestPointerLock;
        this.engine = new BABYLON.Engine(this.canvas, true);
        BABYLON.Engine.ShadersRepository = "./shaders/";
    }
    async createScene() {
        this.scene = new BABYLON.Scene(this.engine);
        this.scene.clearColor = BABYLON.Color4.FromHexString("#000000");
        this.light = new BABYLON.HemisphericLight("light", (new BABYLON.Vector3(-1, 3, 2)).normalize(), this.scene);
        this.camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0));
        this.camera.wheelPrecision *= 10;
        this.camera.setPosition(new BABYLON.Vector3(-2, 3, 5));
        this.camera.attachControl();
        this.camera.getScene();
        let ballData = BABYLON.CreateSphereVertexData({});
        ballData.colors = new Float32Array(ballData.positions.length / 3 * 4);
        ballData.colors.fill(1);
        let ball = new BABYLON.Mesh("ball");
        ballData.applyToMesh(ball);
        ball.material = new ToonMaterial("test-mat", this.scene);
    }
    animate() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
            this.update();
        });
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }
    async initialize() {
    }
    update() {
    }
}
window.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded " + window.location.href);
    let main = new Game("renderCanvas");
    main.createScene();
    main.initialize().then(() => {
        main.animate();
    });
});
class ToonMaterial extends BABYLON.ShaderMaterial {
    constructor(name, scene) {
        super(name, scene, {
            vertex: "toon",
            fragment: "toon",
        }, {
            attributes: ["position", "normal", "uv", "color"],
            uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "lightInvDirW"]
        });
        this.setVector3("lightInvDirW", (new BABYLON.Vector3(0.5, 2.5, 1.5)).normalize());
    }
}
