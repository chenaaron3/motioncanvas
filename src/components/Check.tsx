import { Circle, Line, Rect, RectProps } from '@motion-canvas/2d';
import {
    all, createRef, createSignal, delay, linear, Reference, SimpleSignal, ThreadGenerator
} from '@motion-canvas/core';

export class Check extends Rect {
    private circleRef: Reference<Circle>
    private checkRef: Reference<Line>
    private circleProgress: SimpleSignal<number, this>
    private checkProgress: SimpleSignal<number, this>

    constructor(props: RectProps) {
        const checkSize = 3;
        super(props);
        this.circleProgress = createSignal(0);
        this.checkProgress = createSignal(0);
        this.circleRef = createRef();
        this.checkRef = createRef();
        this.add(
            <Circle
                ref={this.circleRef}
                size={100} // Diameter of the circle
                stroke="00C853" // Color of the circle
                lineWidth={10} // Width of the circle
                startAngle={-90}
                endAngle={-90}
                end={this.circleProgress}
                layout
                justifyContent={'center'}
                alignItems={'center'}
                counterclockwise
            >
                <Line
                    ref={this.checkRef}
                    stroke={'#00C853'}
                    lineWidth={10}
                    points={() => [
                        [checkSize, -4 * checkSize],
                        [5 * checkSize, 0],
                        [15 * checkSize, -10 * checkSize],
                    ]}
                    end={this.checkProgress}
                    lineCap="round"
                    opacity={0}
                />
            </Circle>
        );
    }

    *animate(duration: number): ThreadGenerator {
        yield* all(
            // Start circle animation
            this.circleProgress(1, .5 * duration, linear),
            // After 3/4 of circle completes, start check animation
            delay(.375 * duration, this.checkRef().opacity(1, .01 * duration)),
            delay(.375 * duration, this.checkProgress(1, .5 * duration)),
            delay(.5 * duration, this.circleRef().scale(.85, .125 * duration).to(1, .125 * duration)),
        )
    }
}
