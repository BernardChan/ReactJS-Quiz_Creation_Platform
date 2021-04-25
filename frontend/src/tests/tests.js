/* eslint-disable */
import { shallow } from 'enzyme';
import * as React from 'react';
import { updateOptions } from '../pages/question';
import {newQuiz } from '../pages/question';
import {addQuestions } from '../pages/quiz';

describe('updateOptions', () => {
  const noop = () => {};

  it('triggers onClick event handler when clicked', () => {
    const onClick = jest.fn();
    shallow(<button onClick={onClick} open={false} />).simulate('click');
    expect(onClick).toBeCalledTimes(1);
  });

  it('renders with minimal props', () => {
    const button = renderer.create(<button onClick = {noop} />).toJSON();
    expect(button).toMatchSnapshot();
  })
});

describe('newQuiz', () => {
  const noop = () => {};

  it('triggers onClick event handler when clicked', () => {
    const onClick = jest.fn();
    shallow(<button onClick={onClick} open={false} />).simulate('click');
    expect(onClick).toBeCalledTimes(1);
  });

  it('renders with minimal props', () => {
    const button = renderer.create(<button onClick = {noop} />).toJSON();
    expect(button).toMatchSnapshot();
  })
})

describe('addQuestions', () => {
  const noop = () => {};

  it('triggers onClick event handler when clicked', () => {
    const onClick = jest.fn();
    shallow(<button onClick={onClick} open={false} />).simulate('click');
    expect(onClick).toBeCalledTimes(1);
  });

  it('renders with minimal props', () => {
    const button = renderer.create(<button onClick = {noop} />).toJSON();
    expect(button).toMatchSnapshot();
  })
})
