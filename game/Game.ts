/// <reference path="../lib/babylon.d.ts"/>

class Game {
    
    public static Instance: Game;

	public canvas: HTMLCanvasElement;
	public engine: BABYLON.Engine;
    public scene: BABYLON.Scene;
    public camera: BABYLON.ArcRotateCamera;
    public light: BABYLON.HemisphericLight;

    constructor(canvasElement: string) {
        Game.Instance = this;
        
		this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.msRequestPointerLock || this.canvas.mozRequestPointerLock || this.canvas.webkitRequestPointerLock;
		this.engine = new BABYLON.Engine(this.canvas, true);
		BABYLON.Engine.ShadersRepository = "./shaders/";
	}

    public async createScene(): Promise<void> {
        this.scene = new BABYLON.Scene(this.engine);

        this.scene.clearColor = BABYLON.Color4.FromHexString("#000000");

        this.light = new BABYLON.HemisphericLight("light", (new BABYLON.Vector3(- 1, 3, 2)).normalize(), this.scene);

        this.camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0));
        this.camera.wheelPrecision *= 10;
        this.camera.setPosition(new BABYLON.Vector3(- 2, 3, 5));
        this.camera.attachControl();
        this.camera.getScene();

        let ballData = BABYLON.CreateSphereVertexData({});
        ballData.colors = new Float32Array(ballData.positions.length / 3 * 4);
        ballData.colors.fill(1);
        let ball = new BABYLON.Mesh("ball");
        ballData.applyToMesh(ball);
        ball.material = new ToonMaterial("test-mat", this.scene);
	}

	public animate(): void {
		this.engine.runRenderLoop(() => {
			this.scene.render();
			this.update();
		});

		window.addEventListener("resize", () => {
			this.engine.resize();
		});
	}

    public async initialize(): Promise<void> {
        
    }

    public update(): void {
        
    }
}

window.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded " + window.location.href);

    let main: Game = new Game("renderCanvas");
    main.createScene();
    main.initialize().then(() => {
        main.animate();
    });
});