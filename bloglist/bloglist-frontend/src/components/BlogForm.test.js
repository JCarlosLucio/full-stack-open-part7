import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { act, fireEvent, render } from '@testing-library/react';
import BlogForm from './BlogForm';

describe('<BlogForm />', () => {
  test('should call the form event handler with the right details', async () => {
    const createBlog = jest.fn();

    const component = render(<BlogForm createBlog={createBlog} />);

    const titleInput = component.container.querySelector('#title');
    const authorInput = component.container.querySelector('#author');
    const urlInput = component.container.querySelector('#url');
    const form = component.container.querySelector('form');

    fireEvent.change(titleInput, {
      target: { value: 'title for test' },
    });
    fireEvent.change(authorInput, {
      target: { value: 'author for test' },
    });
    fireEvent.change(urlInput, {
      target: { value: 'url for test' },
    });

    // needed to await act cause onSubmit triggers an async function (addBlog)
    await act(async () => {
      fireEvent.submit(form);
    });

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe('title for test');
    expect(createBlog.mock.calls[0][0].author).toBe('author for test');
    expect(createBlog.mock.calls[0][0].url).toBe('url for test');
  });
});
