import { Behaviour, PlayableDirector, serializeable } from "@needle-tools/engine";
//import { Mathf } from "@needle-tools/engine/src/engine/engine_math";

// Documentation → https://docs.needle.tools/scripting

export class CustomScroll extends Behaviour {

    @serializeable(PlayableDirector)
    timeline?: PlayableDirector;

    @serializeable()
    startOffset: number;

    @serializeable()
    lerpSpeed: number = 2.5;

    private targetTime: number = 0;

    start() {
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
}