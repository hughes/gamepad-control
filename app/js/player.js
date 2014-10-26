define(['three', 'keydrown'], function (THREE, kd) {
    'use strict';
    var Player = function () {
        THREE.Object3D.apply(this);
        this.heading = 0; // aka direction
        this.speed = 200; // cm/sec
        this.name = 'player';
        this.setupMesh();
    };
    Player.prototype = new THREE.Object3D();
    Player.prototype.constructor = Player;
    Player.prototype.setupMesh = function () {
        this.head = new THREE.Object3D();
        this.head.name = 'head';
        this.add(this.head);
        this.head.applyMatrix(new THREE.Matrix4().makeTranslation(0, 180, 25));
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.name = 'head camera';
        this.camera.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));
        this.head.add(this.camera);

        this.cameraHelper = new THREE.CameraHelper(this.camera);
        this.cameraHelper.geometry.applyMatrix(new THREE.Matrix4().makeScale(50, 50, 50));
        // this.camera.add(this.cameraHelper);

        var body = new THREE.BoxGeometry(75, 200, 50);
        body.applyMatrix(new THREE.Matrix4().makeTranslation(0, 100, 0));
        var material = new THREE.MeshLambertMaterial({
            color: 0xeeeeff
        });

        this.mesh = new THREE.Mesh(body, material);
        this.mesh.castShadow = true;
        this.add(this.mesh);

        this.headingHelper = new THREE.AxisHelper(250);
        this.headingHelper.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 1, 0));
        this.add(this.headingHelper);
    };
    Player.prototype.update = function (dt) {
        if (kd.W.isDown()) {
            this.position.z += this.speed * dt;
        }
        if (kd.S.isDown()) {
            this.position.z -= this.speed * dt;
        }
        if (kd.A.isDown()) {
            this.position.x += this.speed * dt;
        }
        if (kd.D.isDown()) {
            this.position.x -= this.speed * dt;
        }
        // this.cameraHelper.update();
    };
    return Player;
});
