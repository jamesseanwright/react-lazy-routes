import * as React from 'react';
import * as testRenderer from 'react-test-renderer';
import Nav from '../Nav';

describe('Nav', () => {
  it('should map an array of paths into a list of links, computing the text of each', () => {
    const paths = ['/foo', '/bar', '/baz'];
    const rendered = testRenderer.create(<Nav paths={paths} />).toJSON();

    expect(rendered).toMatchSnapshot();
  });
});
