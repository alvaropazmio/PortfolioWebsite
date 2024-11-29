import { Behaviour, GameObject, PlayableDirector, serializeable } from "@needle-tools/engine";
import { bool } from "three/examples/jsm/nodes/shadernode/ShaderNode";
//import { Mathf } from "@needle-tools/engine/src/engine/engine_math";

// Documentation → https://docs.needle.tools/scripting

export class CustomScroll extends Behaviour {

    @serializeable(PlayableDirector)
    timeline?: PlayableDirector;

    @serializeable()
    startOffset: number;

    @serializeable()
    lerpSpeed: number = 2.5;

    private isMobile: boolean | undefined;

    private targetTime: number = 0;

    start() {
        

        this.findPlayableDirector();

        window.addEventListener("wheel", (evt: WheelEvent) => this.updateTime(evt.deltaY));
        let lastTouchPosition = -1;
        window.addEventListener("touchmove", (evt: TouchEvent) => {
            if (lastTouchPosition === -1) {
                lastTouchPosition = evt.touches[0].clientY;
            }
            const delta = evt.touches[0].clientY - lastTouchPosition;
            if (delta < 10) {
                this.updateTime(-delta);
            }
            lastTouchPosition = evt.touches[0].clientY;
        });
    }

    private findPlayableDirector() {
        const playableDirector = GameObject.findObjectOfType(PlayableDirector);

        if (playableDirector != null) {

        }
    }

    private updateTime(delta) {
        if (!this.timeline) return;
        this.targetTime += delta * 0.01;
        this.targetTime = this.clamp(this.targetTime, 0, this.timeline.duration);
    }

    onBeforeRender(): void {
        if (!this.timeline) return;
        this.timeline.pause();
        this.timeline.time = this.lerp(this.timeline.time, this.targetTime, this.lerpSpeed * this.context.time.deltaTime);
        this.timeline.evaluate();
    }

    clamp(value: number, min: number, max: number) {

        if (value < min) {
            return min;
        }
        else if (value > max) {
            return max;
        }

        return value;
    }

    lerp(value1: number, value2: number, t: number) {
        t = t < 0 ? 0 : t;
        t = t > 1 ? 1 : t;
        return value1 + (value2 - value1) * t;
    }

    private DetectDevice() {
        if (this.isMobile !== undefined) return this.isMobile;
    if ((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)) {
        return this.isMobile = true;
    }
        return this.isMobile = /iPhone|iPad|iPod|Android|IEMobile/i.test(navigator.userAgent);
}
}