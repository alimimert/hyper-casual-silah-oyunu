import { _decorator, Component, Node, Prefab, instantiate, systemEvent, SystemEvent, EventMouse, RigidBody, Vec3, director, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GunControl')
export class GunControl extends Component {
    @property({ type: Node })
    bulletPoint: Node = null!;

    @property({ type: Prefab })
    bulletPrefab: Prefab = null!;

    @property({ type: Node })
    backPosition: Node = null!;

    private fireInterval: number = 0.3; 
    private nextFireTime: number = 0;
    private isMouseDown: boolean = false;

    private rotationForce: number = 10;
    private maxRotationForce: number = 10; 
    private currentRotationForce: number = 0; 

    onLoad() {
        systemEvent.on(SystemEvent.EventType.MOUSE_DOWN, this.onMouseDown, this);
        systemEvent.on(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    onDestroy() {

        systemEvent.off(SystemEvent.EventType.MOUSE_DOWN, this.onMouseDown, this);
        systemEvent.off(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
    }



    update(deltaTime: number) {

        if (this.canFire() && this.isMouseDown) {
            this.fireBullet();
        }
    }

    private canFire(): boolean {
        return Date.now() >= this.nextFireTime;
    }

    private fireBullet() {
        this.nextFireTime = Date.now() + this.fireInterval * 1000;

        const bulletPointPosition = this.bulletPoint.worldPosition;
        const backPositionZ = this.backPosition.worldPosition.z;

        const direction = this.bulletPoint.forward;
        const bulletSpeed = 7; 

        const bulletNode = instantiate(this.bulletPrefab);
        bulletNode.setPosition(bulletPointPosition);
        this.node.scene.addChild(bulletNode);

        const bulletRigidBody = bulletNode.getComponent(RigidBody);
        if (bulletRigidBody) {
            const bulletVelocity = new Vec3(direction.x * bulletSpeed, direction.y * bulletSpeed, direction.z * bulletSpeed);
            bulletRigidBody.setLinearVelocity(bulletVelocity);
            
            bulletRigidBody.linearFactor = new Vec3(0, 0, 0);
            bulletRigidBody.angularFactor = new Vec3(0, 0, 0);
        }
        this.playFireAnimation();

        const jumpForce = 3000; 
        const zForce = 1000; 

        const gunRigidBody = this.node.getComponent(RigidBody);
        if (gunRigidBody) {
            gunRigidBody.angularFactor = new Vec3(1, 0, 0);

            if (this.node.worldPosition.y <= 9) {
                gunRigidBody.applyForce(new Vec3(0, jumpForce, 0));

                
                if (bulletPointPosition.z > backPositionZ) {
                    gunRigidBody.applyForce(new Vec3(0, 0, -zForce));
                    this.currentRotationForce = -Math.min(this.rotationForce, this.maxRotationForce);
                } else {
                    gunRigidBody.applyForce(new Vec3(0, 0, zForce));
                    this.currentRotationForce = Math.min(this.rotationForce, this.maxRotationForce);
                }

                gunRigidBody.setAngularVelocity(new Vec3(this.currentRotationForce, 0, 0));
            }
        }
    }

    private playFireAnimation() {
        const pistolNode = this.node.getChildByName('Pistol');
        const animationComponent = pistolNode?.getComponent(Animation);
        
        if (animationComponent) {
            animationComponent.play('Pistol'); 
        }
    }

    private onMouseDown(event: EventMouse) {
        if (event.getButton() === 0) { 
            this.isMouseDown = true;
        }
    }

    private onMouseUp(event: EventMouse) {
        if (event.getButton() === 0) { 
            this.isMouseDown = false;
            this.currentRotationForce = 0;
        }
    }
}