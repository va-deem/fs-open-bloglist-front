describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset');
    const user = {
      name: 'Jonn Doe',
      username: 'admin',
      password: 'password'
    };
    const secondUser = {
      name: 'Mary Jane',
      username: 'editor',
      password: 'secret'
    };
    cy.request('POST', 'http://localhost:3001/api/users/', user);
    cy.request('POST', 'http://localhost:3001/api/users/', secondUser);
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.contains('Log in to application');
    cy.contains('username');
    cy.contains('password');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('admin');
      cy.get('#password').type('password');

      cy.get('button[type="submit"]').click();

      cy.contains('blogs');
      cy.contains('logged-in');
    });

    it('fails with wrong credentials', function () {
      cy.get('#username').type('wrong');
      cy.get('#password').type('wrong');

      cy.get('button[type="submit"]').click();

      cy.contains('Wrong credentials').should('have.css', 'color').and('equal', 'rgb(255, 0, 0)');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'admin', password: 'password' });
    });

    it('A blog can be created', function () {
      cy.contains('new blog').click();
      cy.get('input[name="title"]').type('a new test blog');
      cy.get('input[name="author"]').type('Author');
      cy.get('input[name="url"]').type('http://test.test');
      cy.contains('create').click();
      cy.contains('a new test blog Author');
    });

    describe('and several blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'first blog',
          author: 'Author1',
          url: 'http://test1.test'
        });
        cy.createBlog({
          title: 'second blog',
          author: 'Author2',
          url: 'http://test2.test'
        });
        cy.createBlog({
          title: 'third blog',
          author: 'Author3',
          url: 'http://test3.test'
        });
      });

      it('one of those can be liked', function () {
        cy.contains('view').click();
        cy.contains('second blog').parent().contains('like').click();
        cy.contains('second blog').parent().get('.likes-number').contains('1');
      });

      it('one of those can be removed by creator', function () {
        cy.contains('third blog').contains('view').as('viewButton');
        cy.get('@viewButton').click();
        cy.contains('third blog').contains('remove').as('removeButton');
        cy.get('@removeButton').click();
        cy.contains('third blog').should('not.exist');
      });

      it('one of those cannot be removed by another user', function () {
        cy.contains('logout').click();
        cy.login({ username: 'editor', password: 'secret' });
        cy.contains('second blog').contains('view').as('viewButton');
        cy.get('@viewButton').click();
        cy.contains('second blog').contains('remove').should('not.exist');
      });

      it('blogpost are sorted by likes count', function () {
        cy.contains('logout').click();
        cy.login({ username: 'editor', password: 'secret' });
        cy.contains('second blog').contains('view').as('viewButton');
        cy.get('@viewButton').click();
        cy.contains('second blog').contains('remove').should('not.exist');
      });
    });
  });

  describe('Ensure that blogs are sorted by likes count', function () {
    beforeEach(function () {
      cy.login({ username: 'admin', password: 'password' });
      cy.createBlog({
        title: 'first blog',
        author: 'Author1',
        url: 'http://test1.test',
        likes: 10,
      });
      cy.createBlog({
        title: 'second blog',
        author: 'Author2',
        url: 'http://test2.test',
        likes: 20,
      });
      cy.createBlog({
        title: 'third blog',
        author: 'Author3',
        url: 'http://test3.test',
        likes: 30,
      });
    });

    it('one of those can be liked', function () {
      const likesCounts = [30, 20, 10];
      cy.get('.likes-number').then(blogs => {
        const blogLikes = [...blogs].map((el) => Number(el.innerText));
        expect(blogLikes).to.deep.eq(likesCounts);
      });
    });
  });
});
