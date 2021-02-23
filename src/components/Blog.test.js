import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';

const user = { id: 1 };

const blog = {
  id: 1,
  title: 'title',
  author: 'Author',
  url: 'http://blog.com',
  likes: 3,
};

test('renders content', () => {
  const component = render(
    <Blog blog={blog} user={user} />
  );

  const dropSection = component.container.querySelector('.drop-section');
  const blogContent = component.container.querySelector('.blog');
  expect(blogContent).toHaveTextContent('title Author');
  expect(dropSection).not.toBeVisible();
  expect(dropSection).toHaveTextContent('http://blog.com');
  expect(dropSection).toHaveTextContent('3');
});

test('show the details when button clickes', () => {
  const component = render(
    <Blog blog={blog} user={user} />
  );

  const dropSection = component.container.querySelector('.drop-section');
  const button = component.getByText('view');
  fireEvent.click(button);
  expect(dropSection).toBeVisible();
});

test('if likes button is clicked twice', () => {
  const mockHandler = jest.fn();

  const component = render(
    <Blog blog={blog} user={user} handleAddLike={mockHandler} />
  );

  const button = component.getByText('like');
  fireEvent.click(button);
  fireEvent.click(button);
  expect(mockHandler.mock.calls).toHaveLength(2);
});
