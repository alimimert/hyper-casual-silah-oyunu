import { _decorator, Component, Node, Collider, RigidBody } from 'cc';
import { enableSlowMotion, disableSlowMotion } from './SlowMotion'; 
import { setCustomFrameRate } from './FrameRateControl'; 
import { enableSlowMotionForDuration } from './SlowMotion'; 


const { ccclass, property } = _decorator;

@ccclass('EnemyController')
export class EnemyController extends Component {

    private slowMotionActivated: boolean = false;

    onLoad() {
        const collider = this.node.getComponent(Collider);
        if (collider) {
            collider.on('onTriggerEnter', this.onCollisionEnter, this);
        }
    }
    onCollisionEnter(event: any) {
        const otherCollider = event.otherCollider;

        if (otherCollider.node.name === 'bulletPrefab') {
            this.destroyEnemy();
            this.destroyBullet(otherCollider.node);

            enableSlowMotionForDuration(2); 
        }
    }

    destroyEnemy() {
        this.node.destroy();
    }

    destroyBullet(bulletNode: Node) {
        bulletNode.destroy();
    }

    activateSlowMotion() {
        enableSlowMotion(); 
        setCustomFrameRate(120); 
        this.slowMotionActivated = true;
    }

    update(deltaTime: number) {
        if (this.slowMotionActivated) {
            this.slowMotionActivated = false;
            this.scheduleOnce(() => {
                disableSlowMotion(); 
                setCustomFrameRate(60); 
            }, 1); 
        }
    }
}
