import { CODE, Code, lines, makeScene2D, Rect, Txt } from '@motion-canvas/2d';
import {
    all, chain, createRef, fadeTransition, makeRef, sound, SoundBuilder, waitFor
} from '@motion-canvas/core';

import { Check } from '../components/Check';
import { Cross } from '../components/Cross';
import { Expression } from '../components/Expression';
import { SoundEffects } from '../components/SoundEffects';
import { Title } from '../components/Title';
import { Variable } from '../components/Variable';
import { Colors } from '../utils/utils';

export default makeScene2D(function* (view) {
    view.fill(Colors.Background);

    // Refs
    const codeRef = createRef<Code>();
    const titleRef = createRef<Title>();
    const expressionRef = createRef<Expression>();
    const boardRefs = {
        board: null as Rect,
        x: null as Variable,
        y: null as Variable,
        z: null as Variable,
    };

    view.add(
        <>
            <Title ref={titleRef} />
            <Code ref={codeRef} x={-350} />
            <Expression ref={expressionRef} />
            <Rect ref={makeRef(boardRefs, 'board')} x={350}>
                <Rect>
                    <Variable ref={makeRef(boardRefs, 'x')} />
                    <Variable ref={makeRef(boardRefs, 'y')} />
                    <Variable ref={makeRef(boardRefs, 'z')} />
                </Rect>
            </Rect>
        </>
    )

    yield* fadeTransition(1);

    // Introduce expressions
    yield* titleRef().show("Data Types");
    yield* waitFor(2);

    // Reveal Floats
    yield* chain(
        titleRef().dismiss(),
        codeRef().code(CODE`x = 4.20`, 1),
        boardRefs.x.initialize("x", "4.20"),
    )

    // Reveal strings
    yield* all(
        codeRef().code.append(CODE`\ny = "Blaze It"`, 1),
        codeRef().selection(lines(1), 1),
    )
    yield* all(
        boardRefs.x.y(-200, 1),
        boardRefs.y.initialize("y", "\"Blaze It\""),
    )

    // Reveal Boolean
    yield* all(
        codeRef().code.append(CODE`\nz = True`, 1),
        codeRef().selection(lines(2), 1),
    )
    yield* all(
        boardRefs.z.y(200, 1),
        boardRefs.z.initialize("z", "True"),
    )

    // Demonstrate compatible types with operators
    yield* all(
        boardRefs.board.opacity(0, 1),
        codeRef().opacity(0, 1),
    )
    /*
    / 12 + "34" // INVALID
    / "12" + "34" // Evaluates to "1234"
    // 12 + 34 // Evaluates to 46
    */
    yield* expressionRef().code(CODE`12 + "34"`, 1);
    const cross = <Cross position={[0, 150]} /> as Cross;
    view.add(cross);
    yield* cross.animate(1);
    yield* waitFor(1);
    yield* cross.opacity(0, 1);
    cross.remove();

    // Evaluate string variant
    yield* expressionRef().code.replace(
        expressionRef().findFirstRange("12"),
        '"12"',
        1,
    );
    yield* expressionRef().evaluate('"1234"');
    let check = <Check position={[0, 150]} /> as Check;
    view.add(check);
    yield* check.animate(1);
    yield* waitFor(1);
    yield* check.opacity(0, 1);
    check.remove();

    // Evaluate number variant
    yield* expressionRef().code(CODE`12 + 34`, 1);
    yield* expressionRef().evaluate("46");
    check = <Check position={[0, 150]} /> as Check;
    view.add(check);
    yield* check.animate(1);
    yield* waitFor(1);
    yield* check.opacity(0, 1);
    check.remove();
    yield* waitFor(2);
});