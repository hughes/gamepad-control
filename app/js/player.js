define(['three', 'keydrown', 'gamepads'], function (THREE, kd, gamepads) {
    'use strict';
    var Player = function () {
        THREE.Object3D.apply(this);
        this.heading = 0; // aka direction
        this.name = 'player';
        this.movementSpeed = 200; // cm/sec
        this.rotationSpeed = Math.PI / 2; // rad/sec
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
        gamepads.poll();
        this.applyMovement(dt);
        this.applyRotation(dt);
    };
    Player.prototype.applyMovement = function(dt) {
        var directionVector = new THREE.Vector3(0, 0, 0);
        if (kd.W.isDown()) {
            directionVector.z += 1;
        }
        if (kd.S.isDown()) {
            directionVector.z -= 1;
        }
        if (kd.A.isDown()) {
            directionVector.x += 1;
        }
        if (kd.D.isDown()) {
            directionVector.x -= 1;
        }

        directionVector.x -= gamepads.getAxis(0);
        directionVector.z -= gamepads.getAxis(1);

        if (directionVector.length() > 1.0) {
            directionVector.normalize();
        }

        directionVector.multiplyScalar(this.movementSpeed * dt);
        directionVector.applyQuaternion(this.getWorldQuaternion());

        this.position.add(directionVector);
    };
    Player.prototype.applyRotation = function(dt) {
        var rotationScalar = 0;
        if (kd.Q.isDown() || gamepads.get) {
            rotationScalar += 1;
        }
        if (kd.E.isDown()) {
            rotationScalar -= 1;
        }
        rotationScalar -= gamepads.getAxis(2);

        // cap the magnitude
        if (Math.abs(rotationScalar) > 1.0) {
            rotationScalar /= Math.abs(rotationScalar);
        }

        this.rotateY(rotationScalar * this.rotationSpeed * dt);

        var headRotation = 0;
        if (kd.R.isDown()) {
            headRotation -= 1;
        }
        if (kd.F.isDown()) {
            headRotation += 1;
        }
        headRotation += gamepads.getAxis(3);

        // cap the magnitude
        if (Math.abs(headRotation) > 1.0) {
            headRotation /= Math.abs(headRotation);
        }

        this.head.rotateX(headRotation * this.rotationSpeed * dt);
    };
    return Player;
});
