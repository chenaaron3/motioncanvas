import { Code, CODE, lines, makeScene2D, Rect, Txt, word } from '@motion-canvas/2d';
import {
    all, Center, chain, createRef, createSignal, DEFAULT, makeRef, waitFor, waitUntil
} from '@motion-canvas/core';

import { Accent } from '../components/Accent';
import { Circumscribe } from '../components/Circumscribe';
import { Expression } from '../components/Expression';
import { Variable } from '../components/Variable';
import { Colors } from '../utils/utils';

export default makeScene2D(function* (view) {
    view.fill(Colors.Background);
    // Refs
    const codeRef = createRef<Code>();
    const txtRef = createRef<Txt>();
    const expressionRef = createRef<Expression>();
    const boardRef = createRef<Rect>();
    const boardRefs = {
        board: null as Rect,
        x: null as Variable,
        y: null as Variable,
        z: null as Variable,
        expression: null as Expression
    };

    view.add(
        <>
            <Txt textAlign={'center'} ref={txtRef} fill={"white"}></Txt>
            <Expression ref={expressionRef} />
            <Code
                ref={codeRef}
                opacity={0}
            />
            <Rect ref={boardRef} x={350}>
                <Rect>
                    <Variable ref={makeRef(boardRefs, 'x')} />
                    <Variable ref={makeRef(boardRefs, 'y')} />
                    <Variable ref={makeRef(boardRefs, 'z')} />
                </Rect>
                <Expression y={150} layout={false} ref={makeRef(boardRefs, 'expression')} />
            </Rect>
        </>
    )

    // Introduce expressions
    yield* txtRef().text("Expressions", 1);
    yield* waitFor(2);

    // Reveal code
    yield* txtRef().y(-350, 1);
    yield* expressionRef().code(CODE`1 + 3`, 1);

    // Highlight numbers
    yield* waitUntil("Values");
    yield* expressionRef().selection(expressionRef().findAllRanges(/1|3/gm), .25);
    // Highlight operator
    yield* waitUntil("Operators");
    yield* expressionRef().selection(expressionRef().findFirstRange("\\+"), .25);
    // Highlight all
    yield* waitFor(.5);
    yield* expressionRef().selection(DEFAULT, 1);

    // Evaluate the expression by circumscribing 
    yield* waitUntil("Evaluate");
    yield* expressionRef().evaluate(CODE`4`);

    // Highlight the results
    yield* waitUntil("Accentuate");
    yield* new Accent({ target: expressionRef() }).start();

    /*
    / x = 1
    / y = 2
    / z = x + y
    */

    // Introduce x
    yield* all(
        expressionRef().opacity(0, 1),
        codeRef().opacity(1, 1),
        codeRef().code(CODE`x = 1`, 1),
        codeRef().x(-350, 1),
        boardRefs.x.initialize("x", CODE`1`)
    )

    // Introduce y
    yield* all(
        boardRefs.x.x(-75, 1),
        boardRefs.y.x(75, 1),
        codeRef().selection(lines(1), 1),
        codeRef().code.append(CODE`\ny = 2`, 1),
        boardRefs.y.initialize("y", CODE`2`)
    )

    // Introduce expressions
    yield* all(
        codeRef().selection(lines(2), 1),
        codeRef().code.append(CODE`\nx + y`, 1),
        boardRefs.expression.code(CODE`x + y`, 1)
    )

    // Evaluate the expression an assign it into z
    yield* chain(
        boardRefs.expression.evaluateVariable(boardRefs.x),
        boardRefs.expression.evaluateVariable(boardRefs.y),
        boardRefs.expression.evaluate(CODE`3`),
    )

    // Assign result into a variable
    yield* all(
        boardRefs.x.x(-150, 1),
        boardRefs.y.x(0, 1),
        boardRefs.z.x(150, 1),
        codeRef().code.insert([2, 0], 'z = ', 1),
        boardRefs.z.declare("z")
    )
    yield* boardRefs.z.assign(boardRefs.expression);

    // Introduce different expressions by swapping operator
    yield* waitUntil("Operator Deck");
    const operators = ['-', '/', '*', '%'];
    for (const operator of operators) {
        yield* all(
            codeRef().code.replace(word(2, 6, 1), operator, 1),
            boardRefs.z.value.code(eval(boardRefs.x.getValue() + operator + boardRefs.y.getValue()).toString(), 1)
        );
    }
    yield* waitFor(3);
});