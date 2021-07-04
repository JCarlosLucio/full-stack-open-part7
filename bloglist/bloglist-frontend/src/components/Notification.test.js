import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import Notification from './Notification';

describe('<Notification />', () => {
  test('should display success notification ', () => {
    const notification = {
      alert: 'success',
      message: 'Success notification',
    };
    const component = render(<Notification notification={notification} />);
    const div = component.container.querySelector('.notification');
    expect(div).toHaveTextContent('Success notification');
    expect(div).toHaveClass('success');
  });

  test('should display error notification ', () => {
    const notification = {
      alert: 'error',
      message: 'Error notification',
    };
    const component = render(<Notification notification={notification} />);
    const div = component.container.querySelector('.notification');
    expect(div).toHaveTextContent('Error notification');
    expect(div).toHaveClass('error');
  });
});
