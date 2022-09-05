import flowDb from '../c4Db';
import flow from './c4Diagram.jison';
import { setConfig } from '../../../config';

setConfig({
  securityLevel: 'strict',
});

describe('parsing a flow chart', function () {
  beforeEach(function () {
    flow.parser.yy = flowDb;
    flow.parser.yy.clear();
  });

  it('should parse a C4 diagram with one Person correctly', function () {
    flow.parser.parse(`C4Context
title System Context diagram for Internet Banking System
Person(customerA, "Banking Customer A", "A customer of the bank, with personal bank accounts.")`);

    const yy = flow.parser.yy;
    expect(yy.getC4Type()).toBe('C4Context');
    expect(yy.getTitle()).toBe('System Context diagram for Internet Banking System');

    const shapes = yy.getC4ShapeArray();
    expect(shapes.length).toBe(1);
    const onlyShape = shapes[0];

    expect(onlyShape).toEqual({
      alias: 'customerA',
      descr: {
        text: 'A customer of the bank, with personal bank accounts.',
      },
      label: {
        text: 'Banking Customer A',
      },
      parentBoundary: 'global',
      typeC4Shape: {
        text: 'person',
      },
      wrap: false,
    });
  });

  it('should handle a trailing whitespaces after statements', function () {
    const whitespace = ' ';
    const rendered = flow.parser.parse(`C4Context${whitespace}
title System Context diagram for Internet Banking System${whitespace}
Person(customerA, "Banking Customer A", "A customer of the bank, with personal bank accounts.")${whitespace}`);

    expect(rendered).toBe(true);
  });

  it('should handle parameter names that are keywords', function () {
    flow.parser.parse(`C4Context
title title
Person(Person, "Person", "Person")`);

    const yy = flow.parser.yy;
    expect(yy.getTitle()).toBe('title');

    const shapes = yy.getC4ShapeArray();
    expect(shapes.length).toBe(1);
    const onlyShape = shapes[0];

    expect(onlyShape.alias).toBe('Person');
    expect(onlyShape.descr.text).toBe('Person');
    expect(onlyShape.label.text).toBe('Person');
  });

  it('should allow default in the parameters', function () {
    flow.parser.parse(`C4Context
Person(default, "default", "default")`);

    const yy = flow.parser.yy;

    const shapes = yy.getC4ShapeArray();
    expect(shapes.length).toBe(1);
    const onlyShape = shapes[0];

    expect(onlyShape.alias).toBe('default');
    expect(onlyShape.descr.text).toBe('default');
    expect(onlyShape.label.text).toBe('default');
  });
});
