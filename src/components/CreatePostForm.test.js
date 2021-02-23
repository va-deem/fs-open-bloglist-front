import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import CreatePostForm from './CreatePostForm';

test('CreatePostForm test', () => {
  const mockHandler = jest.fn();

  const component = render(
    <CreatePostForm handleAddBlog={mockHandler} />
  );

  const form = component.container.querySelector('form');
  const titleInput = component.container.querySelector('input[name="title"]');
  const authorInput = component.container.querySelector('input[name="author"]');
  const urlInput = component.container.querySelector('input[name="url"]');

  fireEvent.change(titleInput, {
    target: { value: 'title' }
  });

  fireEvent.change(authorInput, {
    target: { value: 'author' }
  });

  fireEvent.change(urlInput, {
    target: { value: 'url' }
  });

  fireEvent.submit(form);

  expect(mockHandler.mock.calls).toHaveLength(1);
  expect(mockHandler.mock.calls[0][0].title).toBe('title');
  expect(mockHandler.mock.calls[0][0].author).toBe('author');
  expect(mockHandler.mock.calls[0][0].url).toBe('url');

});

