import {
    Code, Layout, LayoutProps, Line, Node, NodeProps, PossibleCodeScope, Rect, signal, View2D
} from '@motion-canvas/2d';
import {
    all, createEffect, createRef, createSignal, easeInCubic, easeOutCubic, Reference, SignalValue,
    useLogger
} from '@motion-canvas/core';

import { Colors } from '../utils/utils';
import { Expression } from './Expression';
import { SoundEffects } from './SoundEffects';

export interface VariableProps extends LayoutProps {
}

export class Variable extends Layout {
    private container: Rect
    public name: Code
    public expression: Expression

    CONTAINER_SIZE = 100;

    constructor(props: VariableProps) {
        super({
            ...props
        });
        this.container = <Rect
            stroke={"white"}
            lineWidth={5}
            opacity={0}
            size={this.CONTAINER_SIZE}
        >
        </Rect> as Rect
        this.name = <Code fill={"white"}></Code> as Code
        this.container.add(this.name);
        this.expression = <Expression></Expression> as Expression

        this.add(this.container);
        this.add(this.expression);
    }

    // Show variable without value
    *declare(
        name: SignalValue<PossibleCodeScope>,
        value?: SignalValue<PossibleCodeScope>
    ) {
        // Set the label on top of the container
        this.name.bottom(this.container.top().addY(-25));
        SoundEffects.beep(.25);
        yield* all(
            this.container.opacity(1, 1),
            this.name.code(name, 1),
            value ? this.expression.opacity(1, 1) : null,
        );
    }

    // Initialize = Declare + Assign
    *initialize(
        name: SignalValue<PossibleCodeScope>,
        value: SignalValue<PossibleCodeScope>,
    ) {
        this.setSpawnPoint(this.expression, value);
        yield* this.declare(name, value);
        yield* this.assignValue(value);
    }

    // Blindly assign another expression
    *assign(
        expression: Expression
    ) {
        yield* this.arrowMove(expression);
        this.expression.code(expression.code);
        // If assigning from a fresh expression, remove it
        if (expression != this.expression) {
            expression.remove();
        }
    }

    *assignValue(
        value: SignalValue<PossibleCodeScope>,
        variables?: Variable[],
        evaluate?: SignalValue<PossibleCodeScope>
    ) {
        let expression = this.expression;
        // If we are reassigning, create a new expression
        if (this.getValue().length > 0) {
            expression = new Expression({});
            this.add(expression);
        }
        this.setSpawnPoint(expression, value);
        SoundEffects.boop(.25);
        yield* expression.code(value, 1);
        // Evaluate the variables before assignment
        if (variables) {
            for (let variable of variables) {
                yield* expression.evaluateVariable(variable);
            }
        }
        // Evaluate entire expression
        if (evaluate) {
            yield* expression.evaluate(evaluate);
        }
        yield* this.assign(expression);
    }

    *highlight() {
        yield* all(
            this.container.stroke("yellow", 1),
            this.expression.scale(1.5, 1)
        )
    }

    *unhighlight() {
        yield* all(
            this.container.stroke("white", 1),
            this.expression.scale(1, 1)
        )
    }

    *reset() {
        yield* this.expression.code("", 1);
    }

    *arrowMove(source: Layout, duration: number = 1) {
        const lineRef = createRef<Line>();
        // Draw the arrow
        this.add(<Line
            ref={lineRef}
            stroke={Colors.Assignment}
            lineWidth={8}
            zIndex={-1}
            endArrow
        />);
        // Since everything has different parents, lets use absolute positioning
        let arrowStart = source.position().transformAsPoint(source.parentToWorld());
        let arrowEnd = this.absolutePosition();
        // Points must be transformed to local position
        lineRef().points([
            arrowStart.transformAsPoint(lineRef().worldToParent()),
            arrowEnd.transformAsPoint(lineRef().worldToParent()),
        ]);
        lineRef().end(0);
        yield* lineRef().end(1, duration / 2);
        // Move the source
        const moveSignal = createSignal(arrowStart);
        const unsubscribe = createEffect(() => {
            source.position(moveSignal().transformAsPoint(source.worldToParent()));
            lineRef().points([
                moveSignal().transformAsPoint(lineRef().worldToParent()),
                arrowEnd.transformAsPoint(lineRef().worldToParent()),
            ]);
        });
        SoundEffects.move();
        yield* all(
            moveSignal(arrowEnd, duration / 2, easeOutCubic),
            this.container.width(
                Math.max(this.CONTAINER_SIZE, source.width() + 50),
                duration / 2,
            ),
        )
        unsubscribe();
        // anchor the number
        lineRef().remove();
    }

    private setSpawnPoint(
        source: Expression,
        value: SignalValue<PossibleCodeScope>,
    ): void {
        const startingWorld = this.container.right().addX(100).transformAsPoint(this.localToWorld());
        // Prematurely set the value so we can compute the position correctly
        const initialValue = source.code();
        source.code(value);
        source.left(startingWorld.transformAsPoint(source.worldToParent()));
        source.code(initialValue);
    }

    getName(): string {
        return this.name.code().fragments.toString();
    }

    getValue(): string {
        return this.expression.code().fragments.toString();
    }
}