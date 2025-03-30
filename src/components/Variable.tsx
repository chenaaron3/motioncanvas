import {
    Code, Layout, LayoutProps, Line, Node, NodeProps, PossibleCodeScope, Rect, signal, View2D
} from '@motion-canvas/2d';
import {
    all, createEffect, createRef, createSignal, easeInCubic, Reference, SignalValue, useLogger
} from '@motion-canvas/core';

import { Colors } from '../utils/utils';
import { Expression } from './Expression';

export interface VariableProps extends LayoutProps {
}

export class Variable extends Layout {
    private container: Rect
    public name: Code
    public value: Expression

    constructor(props: VariableProps) {
        super({
            ...props
        });
        this.container = <Rect
            stroke={"white"}
            lineWidth={5}
            opacity={0}
        >
        </Rect> as Rect
        this.name = <Code fill={"white"}></Code> as Code
        this.container.add(this.name);
        this.value = <Expression></Expression> as Expression

        this.add(this.container);
        this.add(this.value);
    }

    // Show variable without value
    *declare(
        name: SignalValue<PossibleCodeScope>,
        value?: SignalValue<PossibleCodeScope>
    ) {
        // Gradually appear
        yield* all(
            this.container.size(100, .25),
            this.size(100, .25),
            this.margin([0, 25], .25)
        )
        // Set the label on top of the container
        this.name.bottom(this.container.top().addY(-25));
        yield* all(
            this.container.opacity(1, 1),
            this.name.code(name, 1),
            value ? this.value.code(value, 1) : null,
        );
    }

    // Declare and assign a variable
    *initialize(
        name: SignalValue<PossibleCodeScope>,
        value: SignalValue<PossibleCodeScope>
    ) {
        this.value.position(this.container.right().addX(100));
        // Gradually appear
        yield* this.declare(name, value);
        yield* this.assign(this.value);
    }

    *assign(
        expression: Expression
    ) {
        yield* arrowMove(expression, this);
        this.value.code(expression.code);
        // If assigning from a fresh expression, remove it
        if (expression != this.value) {
            expression.remove();
        }
    }

    *highlight() {
        yield* all(
            this.container.stroke("yellow", 1),
            this.value.scale(1.5, 1)
        )
    }

    *unhighlight() {
        yield* all(
            this.container.stroke("white", 1),
            this.value.scale(1, 1)
        )
    }

    getName(): string {
        return this.name.code().fragments.toString();
    }

    getValue(): string {
        return this.value.code().fragments.toString();
    }
}

function* arrowMove(source: Node, target: Node, duration: number = 1) {
    const lineRef = createRef<Line>();
    // Draw the arrow
    target.add(<Line
        ref={lineRef}
        stroke={Colors.Assignment}
        lineWidth={8}
        endArrow
    />);
    // Since everything has different parents, lets use absolute positioning
    let arrowStart = source.absolutePosition();
    let arrowEnd = target.absolutePosition();
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
    yield* moveSignal(arrowEnd, duration / 2, easeInCubic);
    unsubscribe();
    // anchor the number
    lineRef().remove();
}