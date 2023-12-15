import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CamControl')
export class CamControl extends Component {
    @property({ type: Node })
    gun: Node = null!;

    private offset: Vec3 = new Vec3();

    private isCamControlActive: boolean = true; 

    start() {
        this.offset.set(this.node.worldPosition);
        this.offset.subtract(this.gun.worldPosition);
    }

    update(deltaTime: number) {
        if (!this.isCamControlActive) {
            return;
        }

        this.node.worldPosition = this.gun.worldPosition.clone().add(this.offset);

        if (this.gun.worldPosition.y < -1) {
            this.isCamControlActive = false;
        }
    }
}
