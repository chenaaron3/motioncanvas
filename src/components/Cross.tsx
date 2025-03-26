import { Circle, Line, Rect, RectProps } from '@motion-canvas/2d';
import {
    all, createRef, createSignal, delay, linear, Reference, SimpleSignal, ThreadGenerator
} from '@motion-canvas/core';

export class Cross extends Rect {
    private circleRef: Reference<Circle>
    private line1Ref: Reference<Line>
    private line2Ref: Reference<Line>
    private circleProgress: SimpleSignal<number, this>
    private line1Progress: SimpleSignal<number, this>
    private line2Progress: SimpleSignal<number, this>

    constructor(props: RectProps) {
        const crossSize = 15;
        super(props);
        this.circleProgress = createSignal(0);
        this.line1Progress = createSignal(0);
        this.line2Progress = createSignal(0);
        this.circleRef = createRef();
        this.line1Ref = createRef();
        this.line2Ref = createRef();
        this.add(
            <Circle
                ref={this.circleRef}
                size={100} // Diameter of the circle
                stroke="red" // Color of the circle
                lineWidth={10} // Width of the circle
                startAngle={-90}
                endAngle={-90}
                end={this.circleProgress}
                counterclockwise
            >
                <Line
                    ref={this.line1Ref}
                    stroke={'red'}
                    lineWidth={10}
                    points={() => [
                        [-crossSize, -crossSize],
                        [crossSize, crossSize],
                    ]}
                    end={this.line1Progress}
                    lineCap="round"
                    opacity={0}
                />
                <Line
                    ref={this.line2Ref}
                    stroke={'red'}
                    lineWidth={10}
                    points={() => [
                        [-crossSize, crossSize],
                        [crossSize, -crossSize],
                    ]}
                    end={this.line2Progress}
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
            // After 3/4 of circle completes, start cross animation
            delay(.375 * duration, this.line1Ref().opacity(1, .01 * duration)),
            delay(.375 * duration, this.line1Progress(1, .5 * duration)),
            delay(.375 * duration, this.line2Ref().opacity(1, .01 * duration)),
            delay(.375 * duration, this.line2Progress(1, .5 * duration)),
            delay(.5 * duration, this.circleRef().scale(.85, .125 * duration).to(1, .125 * duration)),
        )
    }
}
